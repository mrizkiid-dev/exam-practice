<script setup>
import { computed } from 'vue'
import { useExamState } from '../composables/useExamState'

const { currentPage, totalPages, nextPage, prevPage, goToPage } = useExamState()

// On mobile, show at most 5 page pills around the current page to prevent overflow.
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value // 0-based
  if (total <= 7) {
    // Show all pages when there aren't many
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  // Build a window: always include first, last, current ±2, and ellipsis markers (-1)
  const pages = new Set([1, total, current + 1, current, current + 2])
  if (current - 1 >= 1) pages.add(current)       // current-1 (0-based current = current-1 in 1-based)
  if (current + 1 <= total) pages.add(current + 2) // current+1
  const sorted = Array.from(pages).filter(p => p >= 1 && p <= total).sort((a, b) => a - b)

  // Insert ellipsis markers between non-consecutive numbers
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(-1) // ellipsis
    result.push(sorted[i])
  }
  return result
})
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-1 sm:gap-2 py-6 flex-wrap"
  >
    <!-- Previous — large tap target -->
    <button
      :disabled="currentPage === 0"
      class="px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-300 text-sm font-medium
             text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed
             active:bg-gray-100 transition-colors"
      @click="prevPage"
    >
      ← Prev
    </button>

    <!-- Page pills -->
    <template v-for="(n, i) in visiblePages" :key="i">
      <!-- Ellipsis -->
      <span v-if="n === -1" class="w-8 text-center text-gray-400 text-sm select-none">…</span>

      <!-- Page button -->
      <button
        v-else
        :class="[
          'w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl text-sm font-medium transition-colors',
          currentPage === n - 1
            ? 'bg-indigo-600 text-white'
            : 'border border-gray-300 text-gray-700 active:bg-gray-100',
        ]"
        @click="goToPage(n - 1)"
      >
        {{ n }}
      </button>
    </template>

    <!-- Next — large tap target -->
    <button
      :disabled="currentPage >= totalPages - 1"
      class="px-4 py-2.5 min-h-[44px] rounded-xl border border-gray-300 text-sm font-medium
             text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed
             active:bg-gray-100 transition-colors"
      @click="nextPage"
    >
      Next →
    </button>
  </div>
</template>
