<script setup>
import { ref, computed, watch } from 'vue'
import { useExamState } from '../composables/useExamState'

const {
  answerMode,
  itemsPerPage,
  questions,
  setAnswerMode,
  setItemsPerPage,
  resetAllCorrections,
  resetAllAnswers,
} = useExamState()

const total = computed(() => questions.value.length)

// Local draft value shown in the input while the user is typing
const draft = ref(itemsPerPage.value === 'all' ? '' : itemsPerPage.value)

// Keep draft in sync when itemsPerPage changes externally (e.g. on load)
watch(itemsPerPage, (val) => {
  draft.value = val === 'all' ? '' : val
})

const isAll = computed(() => itemsPerPage.value === 'all')

function applyDraft() {
  const n = parseInt(draft.value, 10)
  if (!draft.value || isNaN(n)) {
    // Empty or invalid — revert draft to current value
    draft.value = isAll.value ? '' : itemsPerPage.value
    return
  }
  // Clamp: minimum 1, maximum total questions
  const clamped = Math.min(Math.max(1, n), total.value)
  draft.value = String(clamped)
  setItemsPerPage(String(clamped))
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    e.target.blur()
    applyDraft()
  }
}

function toggleAll() {
  if (isAll.value) {
    // Switch back to last numeric value or default 10
    const fallback = draft.value && !isNaN(parseInt(draft.value)) ? draft.value : '10'
    draft.value = fallback
    setItemsPerPage(fallback)
  } else {
    setItemsPerPage('all')
  }
}
</script>

<template>
  <div class="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">

      <!-- Answer visibility toggle -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
          Answers
        </span>
        <div class="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
          <button
            :class="[
              'px-3 py-2 font-medium transition-colors',
              answerMode === 'show' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 active:bg-gray-100',
            ]"
            @click="setAnswerMode('show')"
          >
            Show
          </button>
          <button
            :class="[
              'px-3 py-2 font-medium transition-colors border-l border-gray-300',
              answerMode === 'hide' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 active:bg-gray-100',
            ]"
            @click="setAnswerMode('hide')"
          >
            Hide
          </button>
        </div>
      </div>

      <!-- Per page: number input + All toggle -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
          Per page
        </span>

        <!-- Number input — disabled when "All" is active -->
        <input
          v-model="draft"
          type="number"
          inputmode="numeric"
          min="1"
          :max="total"
          :disabled="isAll"
          placeholder="e.g. 10"
          class="w-20 text-sm border border-gray-300 rounded-lg px-2 py-2 text-center bg-white
                 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400
                 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
                 [&::-webkit-outer-spin-button]:appearance-none"
          @blur="applyDraft"
          @keydown="handleKeydown"
        />

        <!-- All toggle button -->
        <button
          :class="[
            'text-xs font-semibold px-3 py-2 rounded-lg border transition-colors min-h-[38px]',
            isAll
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 text-gray-600 active:bg-gray-100',
          ]"
          @click="toggleAll"
        >
          All
        </button>

        <!-- Hint -->
        <span v-if="total > 0 && !isAll" class="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">
          1 – {{ total }}
        </span>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 sm:ml-auto flex-wrap">
        <!-- Reset all selected drill answers -->
        <button
          class="text-xs text-gray-500 font-medium border border-gray-300 rounded-lg px-3 py-2
                 active:bg-gray-100 whitespace-nowrap hover:bg-gray-50 transition-colors"
          @click="resetAllAnswers"
        >
          ↺ Reset answers
        </button>

        <!-- Reset all answer-key corrections -->
        <button
          class="text-xs text-red-500 font-medium border border-red-200 rounded-lg px-3 py-2
                 active:bg-red-50 whitespace-nowrap hover:text-red-700 hover:bg-red-50 transition-colors"
          @click="resetAllCorrections"
        >
          Reset key corrections
        </button>
      </div>

    </div>
  </div>
</template>
