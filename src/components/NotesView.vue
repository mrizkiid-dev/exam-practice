<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useNotes } from '../composables/useNotes'
import { noteHref } from '../utils/noteHref'
import NoteTree from './NoteTree.vue'

/*
 * Obsidian-like reader for the markdown vault in public/notes/.
 *  - left:  searchable file tree (drawer on mobile, fixed column on desktop)
 *  - center: rendered note
 *  - right: outline of headings (xl screens; collapsible box on smaller screens)
 */

const {
  tree, treeLoaded, allNotes, matkulFolders,
  activePath, activeNote, siblings,
  noteHtml, noteHeadings, noteLoading, noteError,
  loadTree, loadNote, goNotesHome, leaveNotes,
} = useNotes()

const sidebarOpen = ref(false)
const query = ref('')
const contentEl = ref(null)
const activeHeading = ref(null)
let pendingHeading = null

// ── search: keep files whose name or folder path matches ──────────────────────
const filteredTree = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return tree.value
  const filter = (nodes) => nodes.flatMap((n) => {
    if (n.type === 'file') return n.path.toLowerCase().includes(q) ? [n] : []
    const children = filter(n.children)
    return children.length ? [{ ...n, children }] : []
  })
  return filter(tree.value)
})

// ── load tree once, then react to route changes ───────────────────────────────
// (the tree must be loaded first so [[wikilinks]] can be resolved while rendering)
onMounted(() => { if (!treeLoaded.value) loadTree() })
watch([activePath, treeLoaded], async ([p, ready]) => {
  if (!ready) return
  await loadNote(p)
  await nextTick()
  if (pendingHeading) {
    document.getElementById(pendingHeading)?.scrollIntoView()
    pendingHeading = null
  } else {
    window.scrollTo({ top: 0 })
  }
  observeHeadings()
}, { immediate: true })

// Page title follows the open note
watch(activeNote, (n) => { document.title = n ? `${n.name} · Materi` : 'Materi · Exam Practice' }, { immediate: true })
onBeforeUnmount(() => { document.title = 'Exam Practice'; observer?.disconnect() })

// ── outline: highlight the heading currently in view ─────────────────────────
let observer = null
function observeHeadings() {
  observer?.disconnect()
  activeHeading.value = noteHeadings.value[0]?.id ?? null
  if (!contentEl.value) return
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]) activeHeading.value = visible[0].target.id
  }, { rootMargin: '-72px 0px -70% 0px' })
  contentEl.value.querySelectorAll('h1[id],h2[id],h3[id],h4[id]').forEach((h) => observer.observe(h))
}

function scrollToHeading(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeHeading.value = id
}

// Wikilinks like [[Note#Heading]] carry data-heading; remember it for after navigation
function onContentClick(e) {
  const a = e.target.closest('a[data-heading]')
  if (!a) return
  if (a.getAttribute('href') === noteHref(activePath.value ?? '')) {
    e.preventDefault()
    scrollToHeading(a.dataset.heading)
  } else {
    pendingHeading = a.dataset.heading
  }
}

// Outline only lists h1–h3 to stay readable
const outline = computed(() => noteHeadings.value.filter((h) => h.level <= 3))
const outlineMinLevel = computed(() => Math.min(...outline.value.map((h) => h.level), 6))

const breadcrumb = computed(() => (activeNote.value?.folder ? activeNote.value.folder.split('/') : []))
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">

    <!-- ── Header ────────────────────────────────────────────────────────── -->
    <header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
      <div class="px-3 sm:px-5 h-14 flex items-center gap-2 sm:gap-3">
        <button
          class="lg:hidden shrink-0 w-10 h-10 -ml-1 flex items-center justify-center rounded-lg
                 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
          aria-label="Buka daftar catatan"
          @click="sidebarOpen = true"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button class="shrink-0 font-bold text-indigo-700 tracking-tight" @click="goNotesHome">
          Materi
        </button>

        <!-- Breadcrumb -->
        <nav v-if="activeNote" class="min-w-0 flex items-center gap-1.5 text-sm text-gray-400">
          <template v-for="seg in breadcrumb" :key="seg">
            <span>/</span>
            <span class="hidden sm:inline truncate max-w-[14rem]">{{ seg }}</span>
          </template>
          <span>/</span>
          <span class="text-gray-700 font-medium truncate">{{ activeNote.name }}</span>
        </nav>

        <button
          class="ml-auto shrink-0 text-sm font-semibold text-indigo-600 px-3 py-2 rounded-lg
                 hover:bg-indigo-50 active:bg-indigo-100"
          @click="leaveNotes"
        >
          Latihan Soal →
        </button>
      </div>
    </header>

    <div class="flex-1 flex">

      <!-- ── Sidebar (drawer on mobile) ──────────────────────────────────── -->
      <div
        v-if="sidebarOpen"
        class="lg:hidden fixed inset-0 z-40 bg-black/30"
        @click="sidebarOpen = false"
      />
      <aside
        class="fixed lg:sticky top-0 lg:top-14 z-50 lg:z-0 h-screen lg:h-[calc(100vh-3.5rem)]
               w-72 max-w-[85vw] shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col
               transition-transform duration-200 lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'"
      >
        <div class="p-3 border-b border-gray-200 flex items-center gap-2">
          <input
            v-model="query"
            type="search"
            placeholder="Cari catatan…"
            class="flex-1 min-w-0 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200"
            aria-label="Tutup"
            @click="sidebarOpen = false"
          >✕</button>
        </div>
        <div class="flex-1 overflow-y-auto p-2">
          <NoteTree
            v-if="filteredTree.length"
            :nodes="filteredTree"
            :filtering="!!query.trim()"
            @navigate="sidebarOpen = false"
          />
          <p v-else-if="treeLoaded" class="text-xs text-gray-400 p-3">
            {{ query ? 'Tidak ada catatan yang cocok.' : 'Belum ada catatan.' }}
          </p>
        </div>
        <p class="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-200">
          {{ allNotes.length }} catatan · {{ matkulFolders.length }} matkul
        </p>
      </aside>

      <!-- ── Main content ────────────────────────────────────────────────── -->
      <main class="flex-1 min-w-0 flex justify-center">

        <!-- Vault home: one card per matkul folder -->
        <div v-if="!activePath" class="w-full max-w-3xl px-4 sm:px-8 py-8">
          <h1 class="text-2xl font-bold text-gray-800">Materi Kuliah</h1>
          <p class="text-sm text-gray-500 mt-1">Ringkasan dan bahan belajar per mata kuliah.</p>

          <div v-if="!treeLoaded" class="text-center py-20 text-gray-400 text-sm">Memuat…</div>

          <div v-else-if="matkulFolders.length" class="grid gap-4 sm:grid-cols-2 mt-6">
            <div
              v-for="f in matkulFolders"
              :key="f.path"
              class="rounded-2xl border border-gray-200 p-5 shadow-sm"
            >
              <h2 class="font-bold text-gray-800 leading-snug">{{ f.name }}</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ f.notes.length }} catatan</p>
              <ul class="mt-3 flex flex-col gap-1">
                <li v-for="n in f.notes" :key="n.path">
                  <a
                    :href="noteHref(n.path)"
                    class="block text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate py-0.5"
                  >{{ n.name }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="text-sm text-gray-500 mt-8 rounded-xl bg-gray-50 border border-dashed border-gray-300 p-5">
            Belum ada materi. Buat folder per mata kuliah di
            <code class="text-indigo-700">public/notes/</code> lalu isi dengan file <code>.md</code>.
          </div>
        </div>

        <!-- Open note -->
        <div v-else class="w-full max-w-3xl px-4 sm:px-8 py-6 sm:py-8">
          <div v-if="noteLoading && !noteHtml" class="text-center py-20 text-gray-400 text-sm">Memuat catatan…</div>
          <div v-else-if="noteError" class="text-center py-20 text-sm text-red-500">{{ noteError }}</div>

          <template v-else>
            <!-- Outline on small/medium screens -->
            <details v-if="outline.length > 1" class="xl:hidden mb-6 rounded-xl border border-gray-200 bg-gray-50">
              <summary class="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-gray-700">
                Daftar isi
              </summary>
              <ul class="px-4 pb-3 flex flex-col gap-1">
                <li v-for="h in outline" :key="h.id" :style="{ paddingLeft: `${(h.level - outlineMinLevel) * 12}px` }">
                  <button class="text-left text-sm text-gray-600 hover:text-indigo-700" @click="scrollToHeading(h.id)">
                    {{ h.text }}
                  </button>
                </li>
              </ul>
            </details>

            <article
              ref="contentEl"
              class="note-content prose prose-slate max-w-none prose-sm sm:prose-base
                     prose-headings:scroll-mt-20 prose-a:text-indigo-600
                     prose-code:before:content-none prose-code:after:content-none
                     prose-pre:bg-[#0d1117] prose-pre:p-0"
              @click="onContentClick"
              v-html="noteHtml"
            />

            <!-- Prev / next note in the same matkul -->
            <nav
              v-if="siblings.prev || siblings.next"
              class="mt-12 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3"
            >
              <a
                v-if="siblings.prev"
                :href="noteHref(siblings.prev.path)"
                class="rounded-xl border border-gray-200 p-3 hover:border-indigo-300 hover:bg-indigo-50/50"
              >
                <span class="block text-xs text-gray-400">← Sebelumnya</span>
                <span class="block text-sm font-medium text-gray-700 truncate">{{ siblings.prev.name }}</span>
              </a>
              <span v-else />
              <a
                v-if="siblings.next"
                :href="noteHref(siblings.next.path)"
                class="rounded-xl border border-gray-200 p-3 text-right hover:border-indigo-300 hover:bg-indigo-50/50"
              >
                <span class="block text-xs text-gray-400">Berikutnya →</span>
                <span class="block text-sm font-medium text-gray-700 truncate">{{ siblings.next.name }}</span>
              </a>
            </nav>
          </template>
        </div>
      </main>

      <!-- ── Outline (xl screens) ───────────────────────────────────────── -->
      <aside
        v-if="activePath && outline.length > 1"
        class="hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto
               border-l border-gray-100 py-8 px-4"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Daftar isi</p>
        <ul class="flex flex-col gap-0.5">
          <li v-for="h in outline" :key="h.id">
            <button
              class="w-full text-left text-[13px] leading-snug py-1 pr-1 border-l-2 transition-colors"
              :class="activeHeading === h.id
                ? 'border-indigo-500 text-indigo-700 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-800'"
              :style="{ paddingLeft: `${(h.level - outlineMinLevel) * 12 + 10}px` }"
              @click="scrollToHeading(h.id)"
            >
              {{ h.text }}
            </button>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
