<script setup>
import { ref, onMounted, computed } from 'vue'
import { useExamState } from './composables/useExamState'
import ExamListCard from './components/ExamListCard.vue'
import AddExamModal from './components/AddExamModal.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import QuestionCard from './components/QuestionCard.vue'
import PaginationBar from './components/PaginationBar.vue'

const {
  loadExamList,
  closeExam,
  examList,
  activeFile,
  examInfo,
  pagedQuestions,
  questions,
  currentPage,
  itemsPerPage,
} = useExamState()

onMounted(loadExamList)

const showAddModal = ref(false)

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
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!--  LIST VIEW                                                         -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <template v-if="!activeFile">

      <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 class="text-xl font-bold text-indigo-700 tracking-tight">Exam Practice</h1>
            <p class="text-xs text-gray-400 mt-0.5">Pilih ujian untuk memulai latihan</p>
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
      </header>

      <main class="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        <div v-if="examList.length === 0" class="text-center py-20 text-gray-400 text-sm">
          Memuat daftar ujian…
        </div>

        <ExamListCard
          v-for="entry in examList"
          :key="entry.id"
          :entry="entry"
        />

        <!-- Empty custom state: no file exams + no custom exams -->
        <div
          v-if="examList.length === 0"
          class="text-center py-10 text-gray-400 text-sm"
        >
          Belum ada matkul. Tap "+ Tambah Matkul" untuk menambahkan.
        </div>
      </main>

    </template>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!--  QUIZ VIEW                                                         -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <template v-else>

      <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-3">
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

      <main class="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        <div v-if="questions.length === 0" class="text-center py-20 text-gray-400 text-sm">
          Memuat soal…
        </div>

        <QuestionCard
          v-for="(q, i) in pagedQuestions"
          :key="q.id"
          :question="q"
          :number="pageOffset + i + 1"
          :total="questions.length"
        />

        <PaginationBar />
      </main>

    </template>

    <footer class="text-center text-xs text-gray-300 py-4">Exam Practice SPA</footer>

    <!-- ── Add Exam Modal ──────────────────────────────────────────────── -->
    <AddExamModal v-if="showAddModal" @close="showAddModal = false" />

  </div>
</template>
