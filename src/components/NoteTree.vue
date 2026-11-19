<script setup>
import { useNotes } from '../composables/useNotes'
import { noteHref } from '../utils/noteHref'

/*
 * Recursive file tree for the notes sidebar.
 * When `filter` is set, every folder is shown expanded and only matching files remain
 * (the parent passes an already-filtered tree).
 */
defineProps({
  nodes: { type: Array, required: true },
  depth: { type: Number, default: 0 },
  filtering: { type: Boolean, default: false },
})
const emit = defineEmits(['navigate'])

const { expanded, toggleFolder, activePath } = useNotes()
</script>

<template>
  <ul class="flex flex-col">
    <li v-for="node in nodes" :key="node.path">
      <!-- Folder -->
      <template v-if="node.type === 'folder'">
        <button
          class="w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-left text-sm
                 text-gray-700 hover:bg-gray-200/70 active:bg-gray-200 transition-colors"
          :style="{ paddingLeft: `${depth * 14 + 6}px` }"
          @click="toggleFolder(node.path)"
        >
          <span
            class="text-[10px] text-gray-400 w-3 shrink-0 transition-transform duration-150"
            :class="{ 'rotate-90': filtering || expanded.has(node.path) }"
          >▶</span>
          <span class="font-semibold truncate">{{ node.name }}</span>
        </button>
        <NoteTree
          v-if="filtering || expanded.has(node.path)"
          :nodes="node.children"
          :depth="depth + 1"
          :filtering="filtering"
          @navigate="emit('navigate')"
        />
      </template>

      <!-- File -->
      <a
        v-else
        :href="noteHref(node.path)"
        class="flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-sm transition-colors"
        :class="activePath === node.path
          ? 'bg-indigo-100 text-indigo-800 font-medium'
          : 'text-gray-600 hover:bg-gray-200/70 active:bg-gray-200'"
        :style="{ paddingLeft: `${depth * 14 + 6 + 18}px` }"
        @click="emit('navigate')"
      >
        <span class="truncate">{{ node.name }}</span>
      </a>
    </li>
  </ul>
</template>
