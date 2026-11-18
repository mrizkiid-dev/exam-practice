<script setup>
import { computed } from 'vue'
import { useExamState } from '../composables/useExamState'

const props = defineProps({
  // { id, semester, label, exams: [...] }
  info: { type: Object, required: true },
  // Highlight the most recent semester as the current one
  current: { type: Boolean, default: false },
})

const { openSemester } = useExamState()

const totalQuestions = computed(() =>
  props.info.exams.reduce((sum, e) => sum + (e.totalQuestions || 0), 0)
)
</script>

<template>
  <button
    class="w-full text-left rounded-2xl border shadow-sm p-5 flex items-center gap-4
           hover:shadow-md transition-all duration-150
           focus:outline-none focus:ring-2 focus:ring-indigo-400"
    :class="current
      ? 'bg-indigo-600 border-indigo-600 text-white active:bg-indigo-700 hover:bg-indigo-700'
      : 'bg-white border-gray-200 text-gray-800 active:bg-indigo-50 hover:border-indigo-300'"
    @click="openSemester(info.id)"
  >
    <!-- Big semester number -->
    <div
      class="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
      :class="current ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'"
    >
      {{ info.semester ?? '?' }}
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <h2 class="text-base font-bold leading-snug">{{ info.label }}</h2>
        <span
          v-if="current"
          class="text-[10px] font-semibold uppercase tracking-wide bg-white/25 rounded-full px-2 py-0.5"
        >
          Sekarang
        </span>
      </div>
      <p class="text-xs mt-1" :class="current ? 'text-indigo-100' : 'text-gray-500'">
        <template v-if="info.exams.length">
          {{ info.exams.length }} matkul · {{ totalQuestions }} soal
        </template>
        <template v-else>Belum ada matkul</template>
      </p>
    </div>

    <span class="text-lg" :class="current ? 'text-white' : 'text-indigo-600'">→</span>
  </button>
</template>
