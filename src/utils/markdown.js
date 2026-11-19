import { Marked } from 'marked'
import katex from 'katex'
import hljs from 'highlight.js/lib/common' // common languages incl. java, js, python, sql, c/cpp
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import { noteHref } from './noteHref'

/** Heading text → URL-safe id (keeps letters/digits, collapses the rest to "-"). */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section'
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function renderMath(tex, displayMode) {
  return katex.renderToString(tex, { displayMode, throwOnError: false, output: 'html' })
}

/** Resolve "../x/y.md" against the folder of the current note. */
function resolveRelative(fromPath, href) {
  const parts = fromPath.split('/').slice(0, -1)
  for (const seg of href.split('/')) {
    if (seg === '..') parts.pop()
    else if (seg && seg !== '.') parts.push(seg)
  }
  return parts.join('/')
}


/**
 * Render a markdown note to HTML.
 *
 * Supports, on top of GitHub-flavoured markdown:
 *  - `$inline$` and `$$block$$` math (KaTeX)
 *  - fenced code highlighting (highlight.js)
 *  - Obsidian wikilinks `[[Note]]` / `[[Note|label]]` / `[[Note#Heading]]`
 *  - relative links to other .md files
 *
 * @param {string} src            raw markdown
 * @param {object} ctx
 * @param {string} ctx.path       path of the note being rendered (for relative links)
 * @param {(name: string) => string|null} ctx.resolveWikilink  note name → note path
 * @returns {{ html: string, headings: {id: string, text: string, level: number}[] }}
 */
export function renderMarkdown(src, { path = '', resolveWikilink = () => null } = {}) {
  const headings = []
  const usedIds = new Map()

  const marked = new Marked({ gfm: true })

  marked.use({
    extensions: [
      // $$ … $$ on its own block
      {
        name: 'mathBlock',
        level: 'block',
        start: (s) => s.indexOf('$$'),
        tokenizer(s) {
          const m = /^\$\$([\s\S]+?)\$\$(?:\n|$)/.exec(s)
          if (m) return { type: 'mathBlock', raw: m[0], text: m[1].trim() }
        },
        renderer: (t) => `<div class="math-block">${renderMath(t.text, true)}</div>\n`,
      },
      // $ … $ inline (no space just inside the dollars, not followed by a digit → avoids "$5 and $10")
      {
        name: 'mathInline',
        level: 'inline',
        start: (s) => s.indexOf('$'),
        tokenizer(s) {
          const m = /^\$(?!\s)((?:\\.|[^\\$\n])+?)(?<!\s)\$(?!\d)/.exec(s)
          if (m) return { type: 'mathInline', raw: m[0], text: m[1] }
        },
        renderer: (t) => renderMath(t.text, false),
      },
      // [[Note]], [[Note|Label]], [[Note#Heading]]
      {
        name: 'wikilink',
        level: 'inline',
        start: (s) => s.indexOf('[['),
        tokenizer(s) {
          const m = /^\[\[([^\]|#]+)(#[^\]|]+)?(?:\|([^\]]+))?\]\]/.exec(s)
          if (m) return { type: 'wikilink', raw: m[0], target: m[1].trim(), heading: m[2]?.slice(1), label: m[3] }
        },
        renderer(t) {
          const label = escapeHtml(t.label ?? (t.heading ? `${t.target} › ${t.heading}` : t.target))
          const found = resolveWikilink(t.target)
          if (!found) return `<span class="wikilink wikilink-missing" title="Catatan belum ada">${label}</span>`
          const anchor = t.heading ? ` data-heading="${escapeHtml(slugify(t.heading))}"` : ''
          return `<a class="wikilink" href="${noteHref(found)}"${anchor}>${label}</a>`
        },
      },
    ],

    renderer: {
      // Give headings stable ids and collect them for the outline panel
      heading(text, level, raw) {
        let id = slugify(raw)
        const n = usedIds.get(id) ?? 0
        usedIds.set(id, n + 1)
        if (n) id = `${id}-${n}`
        headings.push({ id, text: raw.replace(/[*_`]/g, ''), level })
        return `<h${level} id="${id}">${text}</h${level}>\n`
      },

      code(code, lang) {
        const language = (lang || '').split(/\s/)[0]
        const out = language && hljs.getLanguage(language)
          ? hljs.highlight(code, { language }).value
          : hljs.highlightAuto(code).value
        const badge = language ? `<span class="code-lang">${escapeHtml(language)}</span>` : ''
        return `<pre>${badge}<code class="hljs">${out}</code></pre>\n`
      },

      // Horizontal scroll wrapper so wide tables don't break the mobile layout
      table(header, body) {
        return `<div class="table-wrap"><table><thead>${header}</thead>${body ? `<tbody>${body}</tbody>` : ''}</table></div>\n`
      },

      // Relative .md links → in-app note links; external links open in a new tab
      link(href, title, text) {
        const t = title ? ` title="${escapeHtml(title)}"` : ''
        if (href && /^https?:\/\//i.test(href)) {
          return `<a href="${escapeHtml(href)}"${t} target="_blank" rel="noopener">${text}</a>`
        }
        if (href && /\.md(#.*)?$/i.test(href)) {
          const [file] = href.split('#')
          return `<a class="wikilink" href="${noteHref(resolveRelative(path, decodeURI(file)))}"${t}>${text}</a>`
        }
        return false // default rendering
      },
    },
  })

  return { html: marked.parse(src), headings }
}
