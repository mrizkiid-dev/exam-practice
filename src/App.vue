<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue'
import { useExamState } from './composables/useExamState'
import ExamListCard from './components/ExamListCard.vue'
import SemesterCard from './components/SemesterCard.vue'
import AddExamModal from './components/AddExamModal.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import QuestionCard from './components/QuestionCard.vue'
import PaginationBar from './components/PaginationBar.vue'
import { useNotes } from './composables/useNotes'

// "Materi" (markdown notes) lives under #/notes; everything else is the quiz app
const { inNotes, goNotesHome } = useNotes()
const NotesView = defineAsyncComponent(() => import('./components/NotesView.vue'))

const {
  loadExamList,
  closeExam,
  semesterList,
  activeSemester,
  activeSemesterInfo,
  closeSemester,
  activeFile,
  examInfo,
  pagedQuestions,
  questions,
  currentPage,
  itemsPerPage,
  columns,
} = useExamState()

// Two-column mode widens the page; the grid itself only splits at lg+ (mobile stays 1 column)
const twoCol = computed(() => columns.value === 2)

const showAddModal = ref(false)
const loaded = ref(false)
onMounted(async () => { await loadExamList(); loaded.value = true })

// The highest-numbered semester is treated as the current one
const currentSemesterId = computed(() =>
  [...semesterList.value].reverse().find((s) => s.semester !== null)?.id ?? null
)

const pageOffset = computed(() => {
  if (itemsPerPage.value === 'all') return 0
  return currentPage.value * Number(itemsPerPage.value)
})

const meta = computed(() => ({
  name:     examInfo.value.name     || '-',
  matkul:   examInfo.value.matkul   || '-',
  semester: examInfo.value.semester || '-',
  prodi:    examInfo.value.prodi    || '-',
}))
</script>

<template>
  <!-- Obsidian-like notes reader -->
  <NotesView v-if="inNotes" />

  <div v-else class="min-h-screen bg-gray-50 flex flex-col">

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!--  HOME: SEMESTER PICKER / EXAM LIST                                 -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <template v-if="!activeFile">

      <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <button
              v-if="activeSemester"
              class="text-indigo-600 font-semibold text-sm flex items-center gap-1 mb-1
                     active:opacity-60 transition-opacity"
              @click="closeSemester"
            >
              ← Semua semester
            </button>
            <h1 class="text-xl font-bold text-indigo-700 tracking-tight truncate">
              {{ activeSemesterInfo ? activeSemesterInfo.label : 'Exam Practice' }}
            </h1>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ activeSemester ? 'Pilih matkul untuk memulai latihan' : 'Pilih semester' }}
            </p>
          </div>

          <!-- Add matkul button -->
          <button
            class="shrink-0 inline-flex items-center gap-2 bg-indigo-600 text-white
                   text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm
                   active:bg-indigo-700 hover:bg-indigo-700 transition-colors"
            @click="showAddModal = true"
          >
            <span class="text-base leading-none">+</span>
            <span>Tambah Matkul</span>
          </button>
        </div>

        <!-- Section tabs: quiz vs. notes -->
        <nav class="max-w-2xl mx-auto px-4 sm:px-6 flex gap-1 -mb-px">
          <span class="px-3 py-2 text-sm font-semibold text-indigo-700 border-b-2 border-indigo-600">
            Latihan Soal
          </span>
          <button
            class="px-3 py-2 text-sm font-semibold text-gray-500 border-b-2 border-transparent
                   hover:text-gray-800 hover:border-gray-300 transition-colors"
            @click="goNotesHome"
          >
            Materi
          </button>
        </nav>
      </header>

      <main class="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        <div v-if="!loaded" class="text-center py-20 text-gray-400 text-sm">
          Memuat daftar ujian…
        </div>

        <!-- Semester picker -->
        <template v-else-if="!activeSemester">
          <SemesterCard
            v-for="s in [...semesterList].reverse()"
            :key="s.id"
            :info="s"
            :current="s.id === currentSemesterId"
          />
          <div v-if="semesterList.length === 0" class="text-center py-10 text-gray-400 text-sm">
            Belum ada data semester. Buat folder <code>public/data/semesterN/</code>.
          </div>
        </template>

        <!-- Exams in the selected semester -->
        <template v-else>
          <ExamListCard
            v-for="entry in activeSemesterInfo?.exams ?? []"
            :key="entry.id"
            :entry="entry"
          />
          <div
            v-if="!activeSemesterInfo?.exams.length"
            class="text-center py-10 text-gray-400 text-sm"
          >
            Belum ada matkul di semester ini. Tap "+ Tambah Matkul" untuk menambahkan.
          </div>
        </template>
      </main>

    </template>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!--  QUIZ VIEW                                                         -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <template v-else>

      <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div :class="['mx-auto px-4 sm:px-6 py-3', twoCol ? 'max-w-3xl lg:max-w-7xl' : 'max-w-3xl']">
          <div class="flex items-center gap-3">
            <button
              class="shrink-0 text-indigo-600 font-semibold text-sm flex items-center gap-1
                     active:opacity-60 transition-opacity"
              @click="closeExam"
            >
              ← Kembali
            </button>
            <span class="h-4 w-px bg-gray-200"></span>
            <span class="text-xs text-gray-400 font-medium">{{ questions.length }} soal</span>
          </div>
          <div class="mt-1.5">
            <p class="text-sm font-bold text-gray-800 leading-tight">{{ meta.name }}</p>
            <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              <span class="text-xs text-gray-500">
                <span class="text-gray-400 font-medium">Matkul</span> {{ meta.matkul }}
              </span>
              <span class="text-xs text-gray-500">
                <span class="text-gray-400 font-medium">Semester</span> {{ meta.semester }}
              </span>
              <span class="text-xs text-gray-500">
                <span class="text-gray-400 font-medium">Prodi</span> {{ meta.prodi }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <SettingsPanel />

      <main
        :class="[
          'flex-1 w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4',
          twoCol ? 'max-w-3xl lg:max-w-7xl' : 'max-w-3xl',
        ]"
      >
        <div v-if="questions.length === 0" class="text-center py-20 text-gray-400 text-sm">
          Memuat soal…
        </div>

        <!-- Questions grid: row-major, so 2-column mode pairs 1|2, 3|4, … -->
        <div :class="['grid gap-4', twoCol ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1']">
          <QuestionCard
            v-for="(q, i) in pagedQuestions"
            :key="q.id"
            :question="q"
            :number="pageOffset + i + 1"
            :total="questions.length"
          />
        </div>

        <PaginationBar />
      </main>

    </template>

    <footer class="text-center text-xs text-gray-300 py-4">Exam Practice SPA</footer>

    <!-- ── Add Exam Modal ──────────────────────────────────────────────── -->
    <AddExamModal v-if="showAddModal" @close="showAddModal = false" />

  </div>
</template>
