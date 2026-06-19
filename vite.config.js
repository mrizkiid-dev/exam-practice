import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

/**
 * Scans public/data/ and writes index.json automatically.
 * - Runs once on dev-server start and on every build.
 * - In dev mode, watches the folder: add or delete a .json file
 *   and index.json is regenerated instantly (reload the page to pick it up).
 */
function examAutoIndex() {
  const dataDir = path.resolve('public/data')

  function rebuild() {
    const files = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith('.json') && f !== 'index.json')
      .sort()

    fs.writeFileSync(
      path.join(dataDir, 'index.json'),
      JSON.stringify(files, null, 2) + '\n'
    )
    console.log('[exam-index] index.json →', files)
  }

  return {
    name: 'exam-auto-index',

    // Runs before every build
    buildStart() {
      rebuild()
    },

    // Runs when the dev server starts; also watches for file changes
    configureServer(server) {
      rebuild()

      server.watcher.add(dataDir)

      server.watcher.on('add', (file) => {
        if (file.includes(path.sep + 'data' + path.sep) && file.endsWith('.json') && !file.endsWith('index.json')) {
          rebuild()
          // Notify the browser so it can reload
          server.ws.send({ type: 'full-reload' })
        }
      })

      server.watcher.on('unlink', (file) => {
        if (file.includes(path.sep + 'data' + path.sep) && file.endsWith('.json') && !file.endsWith('index.json')) {
          rebuild()
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}

export default defineConfig({
  // In CI, set VITE_BASE env var to your repo name, e.g. VITE_BASE=/my-repo/
  // Locally it defaults to '/' so npm run dev still works as-is.
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), examAutoIndex()],
})
