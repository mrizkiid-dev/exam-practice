<script setup>
import { useExamState } from '../composables/useExamState'

const props = defineProps({
  entry: {
    type: Object,
    required: true,
    // { id, file?, exam, totalQuestions, isCustom }
  },
})

const { openExam, openCustomExam, removeCustomExam } = useExamState()

const meta = {
  name:     props.entry.exam.name     || '-',
  matkul:   props.entry.exam.matkul   || '-',
  semester: props.entry.exam.semester || '-',
  prodi:    props.entry.exam.prodi    || '-',
}

function open() {
  if (props.entry.isCustom) {
    openCustomExam(props.entry.id)
  } else {
    openExam(props.entry.file)
  }
}

function handleDelete(e) {
  e.stopPropagation()
  if (confirm(`Hapus "${meta.name}"? Data soal akan dihapus dari perangkat ini.`)) {
    removeCustomExam(props.entry.id)
  }
}
</script>

<template>
  <div class="relative group">
    <button
      class="w-full text-left bg-white rounded-2xl border border-gray-200 shadow-sm
             p-5 flex flex-col gap-3 active:bg-indigo-50 active:border-indigo-300
             hover:border-indigo-300 hover:shadow-md transition-all duration-150
             focus:outline-none focus:ring-2 focus:ring-indigo-400"
      @click="open"
    >
      <!-- Top row: name + badge -->
      <div class="flex items-start justify-between gap-3">
        <h2 class="text-base font-bold text-gray-800 leading-snug pr-6">
          {{ meta.name }}
        </h2>
        <span class="shrink-0 text-xs font-semibold bg-indigo-100 text-indigo-700
                     rounded-full px-2.5 py-1 whitespace-nowrap">
          {{ entry.totalQuestions }} soal
        </span>
      </div>

      <!-- Detail chips -->
      <div class="flex flex-wrap gap-2">
        <span class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1">
          <span class="font-medium text-gray-400">Matkul</span> {{ meta.matkul }}
        </span>
        <span class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1">
          <span class="font-medium text-gray-400">Semester</span> {{ meta.semester }}
        </span>
        <span class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1">
          <span class="font-medium text-gray-400">Prodi</span> {{ meta.prodi }}
        </span>
        <!-- Custom badge -->
        <span
          v-if="entry.isCustom"
          class="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 rounded-lg px-2.5 py-1 font-medium"
        >
          Ditambahkan manual
        </span>
      </div>

      <!-- CTA -->
      <div class="flex items-center text-indigo-600 text-sm font-semibold gap-1 mt-1">
        Mulai latihan <span>→</span>
      </div>
    </button>

    <!-- Delete button for custom exams -->
    <button
      v-if="entry.isCustom"
      class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
             rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50
             active:bg-red-100 transition-colors"
      title="Hapus matkul"
      @click="handleDelete"
    >
      ✕
    </button>
  </div>
</template>
