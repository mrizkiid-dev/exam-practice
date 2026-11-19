import { ref, computed } from 'vue'
import { noteHref } from '../utils/noteHref'
// The markdown renderer (marked + KaTeX + highlight.js) is heavy, so it is loaded
// lazily the first time a note is opened — the quiz pages never download it.
const loadRenderer = () => import('../utils/markdown')

/*
 * Notes ("Materi") state — an Obsidian-like vault served from public/notes/.
 *
 * Layout on disk: one folder per matkul, markdown files inside (subfolders allowed).
 *   public/notes/MSIM4202 Struktur Data/Bahan Ajar Persiapan UAS.md
 * The Vite plugin generates public/notes/index.json (the file tree).
 *
 * Routing uses the URL hash so a note can be refreshed / bookmarked / shared:
 *   #/notes                          → vault home
 *   #/notes/<Folder>/<Note name>     → open that note (".md" omitted)
 *   anything else                    → the exam (quiz) part of the app
 */

const LS_EXPANDED_KEY = 'notes_expanded_folders'

// ── state ─────────────────────────────────────────────────────────────────────

const route = ref(window.location.hash)
const tree = ref([])            // file tree from index.json
const treeLoaded = ref(false)
const noteHtml = ref('')
const noteHeadings = ref([])
const noteLoading = ref(false)
const noteError = ref('')
const expanded = ref(loadExpanded())

function loadExpanded() {
  try { return new Set(JSON.parse(localStorage.getItem(LS_EXPANDED_KEY)) ?? []) } catch { return new Set() }
}
function saveExpanded() {
  try { localStorage.setItem(LS_EXPANDED_KEY, JSON.stringify([...expanded.value])) } catch { /* ignore */ }
}

window.addEventListener('hashchange', () => { route.value = window.location.hash })

// ── derived ───────────────────────────────────────────────────────────────────

const inNotes = computed(() => route.value === '#/notes' || route.value.startsWith('#/notes/'))

/** Path of the open note ("Folder/Note.md"), or null on the vault home. */
const activePath = computed(() => {
  if (!route.value.startsWith('#/notes/')) return null
  const rest = route.value.slice('#/notes/'.length)
  if (!rest) return null
  try { return rest.split('/').map(decodeURIComponent).join('/') + '.md' } catch { return null }
})

/** Flat list of every note: [{ name, path, folder }] */
const allNotes = computed(() => {
  const out = []
  const walk = (nodes, folder) => nodes.forEach((n) => {
    if (n.type === 'folder') walk(n.children, folder ? `${folder}/${n.name}` : n.name)
    else out.push({ name: n.name, path: n.path, folder })
  })
  walk(tree.value, '')
  return out
})

const activeNote = computed(() => allNotes.value.find((n) => n.path === activePath.value) ?? null)

/** Top-level folders = matkul. Used for the vault home cards. */
const matkulFolders = computed(() =>
  tree.value
    .filter((n) => n.type === 'folder')
    .map((f) => ({ ...f, notes: allNotes.value.filter((n) => n.path.startsWith(f.path + '/')) }))
)

/** Previous / next note inside the same top-level matkul folder. */
const siblings = computed(() => {
  const cur = activeNote.value
  if (!cur) return { prev: null, next: null }
  const top = cur.path.split('/')[0]
  const list = allNotes.value.filter((n) => n.path.split('/')[0] === top)
  const i = list.findIndex((n) => n.path === cur.path)
  return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null }
})

// ── actions ───────────────────────────────────────────────────────────────────

const base = import.meta.env.BASE_URL
const fileUrl = (p) => `${base}notes/${p.split('/').map(encodeURIComponent).join('/')}`

async function loadTree() {
  try {
    const res = await fetch(`${base}notes/index.json`, { cache: 'no-cache' })
    tree.value = res.ok ? await res.json() : []
  } catch {
    tree.value = []
  }
  treeLoaded.value = true
}

/** Wikilink resolution, Obsidian style: match by note name (case-insensitive), prefer same folder. */
function resolveWikilink(name) {
  const target = name.toLowerCase().replace(/\.md$/, '')
  const byPath = allNotes.value.find((n) => n.path.toLowerCase().replace(/\.md$/, '') === target)
  if (byPath) return byPath.path
  const matches = allNotes.value.filter((n) => n.name.toLowerCase() === target.split('/').pop())
  if (!matches.length) return null
  const curFolder = activeNote.value?.folder
  return (matches.find((n) => n.folder === curFolder) ?? matches[0]).path
}

let loadToken = 0
async function loadNote(path) {
  const token = ++loadToken
  noteError.value = ''
  if (!path) { noteHtml.value = ''; noteHeadings.value = []; return }
  noteLoading.value = true
  try {
    const res = await fetch(fileUrl(path), { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    const { renderMarkdown } = await loadRenderer()
    if (token !== loadToken) return // a newer navigation won
    const { html, headings } = renderMarkdown(text, { path, resolveWikilink })
    noteHtml.value = html
    noteHeadings.value = headings
    // Auto-expand the folders leading to this note
    const parts = path.split('/')
    for (let i = 1; i < parts.length; i++) expanded.value.add(parts.slice(0, i).join('/'))
    expanded.value = new Set(expanded.value)
    saveExpanded()
  } catch (e) {
    if (token !== loadToken) return
    noteHtml.value = ''
    noteHeadings.value = []
    noteError.value = `Catatan tidak ditemukan (${e.message}).`
  } finally {
    if (token === loadToken) noteLoading.value = false
  }
}

function toggleFolder(path) {
  const s = new Set(expanded.value)
  s.has(path) ? s.delete(path) : s.add(path)
  expanded.value = s
  saveExpanded()
}

function openNote(path) { window.location.hash = noteHref(path).slice(1) }
function goNotesHome() { window.location.hash = '/notes' }
function leaveNotes() { window.location.hash = '' }

export function useNotes() {
  return {
    route, inNotes, tree, treeLoaded, allNotes, matkulFolders,
    activePath, activeNote, siblings,
    noteHtml, noteHeadings, noteLoading, noteError,
    expanded, toggleFolder,
    loadTree, loadNote, openNote, goNotesHome, leaveNotes,
  }
}
