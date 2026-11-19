import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

/**
 * Scans public/data/semesterN/ folders and writes public/data/index.json.
 * Output shape:
 *   [{ "id": "semester4", "semester": "4", "files": ["semester4/ekma4158.json", ...] }, ...]
 * - Runs once on dev-server start and on every build.
 * - In dev mode, watches the folder: adding/removing a semester folder or a
 *   .json file regenerates index.json and reloads the browser.
 */
function examAutoIndex() {
  const dataDir = path.resolve('public/data')
  const SEMESTER_DIR = /^semester(\d+)$/

  function rebuild() {
    const semesters = fs
      .readdirSync(dataDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && SEMESTER_DIR.test(d.name))
      .map((d) => ({
        id: d.name,
        semester: d.name.match(SEMESTER_DIR)[1],
        files: fs
          .readdirSync(path.join(dataDir, d.name))
          .filter((f) => f.endsWith('.json'))
          .sort()
          .map((f) => `${d.name}/${f}`),
      }))
      .sort((a, b) => Number(a.semester) - Number(b.semester))

    fs.writeFileSync(
      path.join(dataDir, 'index.json'),
      JSON.stringify(semesters, null, 2) + '\n'
    )
    console.log('[exam-index] index.json →', semesters.map((s) => `${s.id} (${s.files.length})`).join(', '))
  }

  // Only react to changes inside public/data/, ignoring the generated index itself
  const isDataChange = (file) =>
    file.startsWith(dataDir + path.sep) && !file.endsWith(path.sep + 'index.json')

  return {
    name: 'exam-auto-index',

    // Runs before every build
    buildStart() {
      rebuild()
    },

    // Runs when the dev server starts; also watches for file/folder changes
    configureServer(server) {
      rebuild()
      server.watcher.add(dataDir)

      const onChange = (file) => {
        if (!isDataChange(file)) return
        rebuild()
        server.ws.send({ type: 'full-reload' })
      }
      for (const evt of ['add', 'unlink', 'addDir', 'unlinkDir']) server.watcher.on(evt, onChange)
    },
  }
}

/**
 * Scans public/notes/ (one folder per matkul, any nesting) and writes
 * public/notes/index.json as a file tree, Obsidian-vault style:
 *   [{ "type": "folder", "name": "MSIM4202 Struktur Data", "path": "MSIM4202 Struktur Data",
 *      "children": [{ "type": "file", "name": "Bahan Ajar", "path": "MSIM4202 Struktur Data/Bahan Ajar.md" }] }]
 * - Folders first, then files, both sorted naturally (so "2 …" comes before "10 …").
 * - Hidden entries (starting with "." or "_") are skipped.
 * - In dev mode, any .md add/remove/edit regenerates the index and reloads the page.
 */
function notesAutoIndex() {
  const notesDir = path.resolve('public/notes')
  const collator = new Intl.Collator('id', { numeric: true, sensitivity: 'base' })

  function walk(dir, rel) {
    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => !d.name.startsWith('.') && !d.name.startsWith('_'))

    const folders = entries
      .filter((d) => d.isDirectory())
      .map((d) => {
        const p = rel ? `${rel}/${d.name}` : d.name
        return { type: 'folder', name: d.name, path: p, children: walk(path.join(dir, d.name), p) }
      })
      .sort((a, b) => collator.compare(a.name, b.name))

    const files = entries
      .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.md'))
      .map((d) => ({
        type: 'file',
        name: d.name.replace(/\.md$/i, ''),
        path: rel ? `${rel}/${d.name}` : d.name,
      }))
      .sort((a, b) => collator.compare(a.name, b.name))

    return [...folders, ...files]
  }

  function rebuild() {
    if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true })
    const tree = walk(notesDir, '')
    fs.writeFileSync(path.join(notesDir, 'index.json'), JSON.stringify(tree, null, 2) + '\n')
    console.log('[notes-index] index.json →', tree.length, 'top-level entries')
  }

  const isNotesChange = (file) =>
    file.startsWith(notesDir + path.sep) && !file.endsWith(path.sep + 'index.json')

  return {
    name: 'notes-auto-index',
    buildStart() {
      rebuild()
    },
    configureServer(server) {
      rebuild()
      server.watcher.add(notesDir)
      const onChange = (file) => {
        if (!isNotesChange(file)) return
        rebuild()
        server.ws.send({ type: 'full-reload' })
      }
      // 'change' too, so editing a note live-refreshes the open page
      for (const evt of ['add', 'unlink', 'addDir', 'unlinkDir', 'change']) server.watcher.on(evt, onChange)
    },
  }
}

export default defineConfig({
  // In CI, set VITE_BASE env var to your repo name, e.g. VITE_BASE=/my-repo/
  // Locally it defaults to '/' so npm run dev still works as-is.
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), examAutoIndex(), notesAutoIndex()],
})
