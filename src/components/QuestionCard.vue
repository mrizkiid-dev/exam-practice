<script setup>
import { ref, watch } from 'vue'
import { useExamState } from '../composables/useExamState'

const props = defineProps({
  question: {
    type: Object,
    required: true,
    // { id, question, options, answer, activeAnswer, isCorrected }
  },
  number: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})

const { answerMode, drillSession, setCorrection, resetCorrection } = useExamState()

// ── local state ───────────────────────────────────────────────────────────────

const selectedIndex = ref(null)   // user's pick in drill mode
const isEditing = ref(false)      // edit-answer-key mode active
const editSelection = ref(null)   // tentative new correct answer while editing

// Reset drill answer when the question changes (pagination) or when the
// global drillSession bumps (user pressed "Reset all answers")
watch(
  [() => props.question.id, drillSession],
  () => {
    selectedIndex.value = null
    isEditing.value = false
    editSelection.value = null
  }
)

// ── option styling ────────────────────────────────────────────────────────────

function optionClass(index) {
  const base =
    'w-full text-left px-4 py-3 min-h-[48px] rounded-xl border text-sm font-medium ' +
    'transition-colors duration-150 focus:outline-none flex items-center gap-2 '

  // ── EDIT MODE ──
  if (isEditing.value) {
    if (index === editSelection.value)
      return base + 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
    if (index === props.question.activeAnswer && editSelection.value !== index)
      return base + 'border-blue-300 text-blue-700 bg-blue-50'
    return base + 'border-gray-300 text-gray-700 active:bg-gray-100 cursor-pointer'
  }

  // ── SHOW MODE ──
  if (answerMode.value === 'show') {
    if (index === props.question.activeAnswer)
      return base + 'bg-green-100 border-green-500 text-green-800'
    return base + 'border-gray-200 text-gray-500'
  }

  // ── HIDE MODE — before click ──
  if (selectedIndex.value === null)
    return base + 'border-gray-300 text-gray-700 active:bg-gray-100 cursor-pointer'

  // ── HIDE MODE — after click ──
  if (index === props.question.activeAnswer)
    return base + 'bg-green-100 border-green-500 text-green-800'
  if (index === selectedIndex.value)
    return base + 'bg-red-100 border-red-500 text-red-800'
  return base + 'border-gray-200 text-gray-300 cursor-default'
}

function optionIcon(index) {
  if (isEditing.value) {
    if (index === editSelection.value) return '✓'
    return null
  }
  if (answerMode.value === 'show' && index === props.question.activeAnswer) return '✓'
  if (selectedIndex.value !== null) {
    if (index === props.question.activeAnswer) return '✓'
    if (index === selectedIndex.value) return '✗'
  }
  return null
}

// ── drill actions ─────────────────────────────────────────────────────────────

function selectOption(index) {
  if (answerMode.value === 'show') return
  if (selectedIndex.value !== null) return
  selectedIndex.value = index
}

// ── edit-answer-key actions ───────────────────────────────────────────────────

function enterEditMode() {
  isEditing.value = true
  editSelection.value = props.question.activeAnswer
  selectedIndex.value = null
}

function cancelEdit() {
  isEditing.value = false
  editSelection.value = null
}

function saveEdit() {
  if (editSelection.value === null) return
  setCorrection(props.question.id, editSelection.value)
  isEditing.value = false
  editSelection.value = null
}

function handleResetOne() {
  resetCorrection(props.question.id)
  isEditing.value = false
  editSelection.value = null
  selectedIndex.value = null
}

const LABELS = ['A', 'B', 'C', 'D']
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-sm border flex flex-col gap-0 overflow-hidden"
    :class="isEditing ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'"
  >
    <!-- ── Edit-mode banner ────────────────────────────────────────────── -->
    <div
      v-if="isEditing"
      class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 text-sm font-medium"
    >
      <span>✎</span>
      <span>Select the correct answer below, then tap Save</span>
    </div>

    <!-- ── Corrected badge banner ──────────────────────────────────────── -->
    <div
      v-else-if="question.isCorrected && !isEditing"
      class="flex items-center justify-between gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2"
    >
      <span class="text-xs font-medium text-amber-700 flex items-center gap-1.5">
        <span>⚠</span> Answer key has been corrected
      </span>
      <button
        class="text-xs font-semibold text-amber-700 underline underline-offset-2 active:opacity-60"
        @click="handleResetOne"
      >
        Reset to original
      </button>
    </div>

    <!-- ── Card body ───────────────────────────────────────────────────── -->
    <div class="p-4 sm:p-6 flex flex-col gap-4">

      <!-- Question number + text -->
      <div class="flex items-start gap-3">
        <span class="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full
                     bg-indigo-100 text-indigo-700 text-sm font-bold leading-none">
          {{ number }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-400 mb-0.5">Question {{ number }} of {{ total }}</p>
          <p class="text-gray-800 font-semibold text-base leading-snug">
            {{ question.question }}
          </p>
        </div>
      </div>

      <!-- Options -->
      <div class="flex flex-col gap-2">
        <button
          v-for="(option, index) in question.options"
          :key="index"
          :class="optionClass(index)"
          :disabled="!isEditing && (answerMode === 'show' || selectedIndex !== null)"
          @click="isEditing ? (editSelection = index) : selectOption(index)"
        >
          <span class="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold"
            :class="[
              optionIcon(index) === '✓' ? 'bg-current border-current text-white' : 'border-current opacity-50'
            ]"
          >
            {{ optionIcon(index) || LABELS[index] }}
          </span>
          <span>{{ option }}</span>
        </button>
      </div>

      <!-- Drill feedback -->
      <p
        v-if="answerMode === 'hide' && selectedIndex !== null && !isEditing"
        class="text-sm font-semibold"
        :class="selectedIndex === question.activeAnswer ? 'text-green-700' : 'text-red-700'"
      >
        {{ selectedIndex === question.activeAnswer
          ? '✓ Benar!'
          : '✗ Salah — lihat jawaban yang disorot.' }}
      </p>

      <!-- Explanation box — visible in show mode always, or in hide mode after answering -->
      <div
        v-if="question.explanation && !isEditing && (answerMode === 'show' || selectedIndex !== null)"
        class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex flex-col gap-1"
      >
        <p class="text-xs font-bold text-green-700">
          Jawaban: {{ LABELS[question.activeAnswer] }}
        </p>
        <p class="text-sm text-green-900 leading-relaxed">
          {{ question.explanation }}
        </p>
      </div>

      <!-- ── Action bar ──────────────────────────────────────────────── -->
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">

        <!-- Normal mode -->
        <template v-if="!isEditing">
          <button
            class="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600
                   border border-indigo-200 rounded-lg px-3 py-2 min-h-[36px]
                   active:bg-indigo-50 transition-colors"
            @click="enterEditMode"
          >
            ✎ Edit answer key
          </button>

          <button
            v-if="answerMode === 'hide' && selectedIndex !== null"
            class="ml-auto text-xs text-gray-500 py-2 px-3 rounded-lg border border-gray-200
                   active:bg-gray-100 min-h-[36px]"
            @click="selectedIndex = null"
          >
            Try again
          </button>
        </template>

        <!-- Edit mode -->
        <template v-else>
          <span class="text-xs text-gray-400 italic">
            Currently:
            <strong class="text-gray-600 not-italic">
              {{ LABELS[question.activeAnswer] }}. {{ question.options[question.activeAnswer] }}
            </strong>
          </span>
          <div class="ml-auto flex gap-2">
            <button
              class="text-sm px-4 py-2 min-h-[40px] rounded-xl bg-indigo-600 text-white font-medium
                     disabled:opacity-40 active:bg-indigo-700 transition-colors"
              :disabled="editSelection === null || editSelection === question.activeAnswer"
              @click="saveEdit"
            >
              Save
            </button>
            <button
              class="text-sm px-4 py-2 min-h-[40px] rounded-xl border border-gray-300
                     text-gray-600 active:bg-gray-100 transition-colors"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>
