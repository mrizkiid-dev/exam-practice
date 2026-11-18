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

export default defineConfig({
  // In CI, set VITE_BASE env var to your repo name, e.g. VITE_BASE=/my-repo/
  // Locally it defaults to '/' so npm run dev still works as-is.
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), examAutoIndex()],
})
