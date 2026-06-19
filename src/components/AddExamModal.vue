<script setup>
import { ref, computed, watch } from 'vue'
import { useExamState } from '../composables/useExamState'

const emit = defineEmits(['close'])
const { addCustomExam } = useExamState()

// ── state ─────────────────────────────────────────────────────────────────────

const raw = ref('')            // what the user typed / pasted
const activeTab = ref('paste') // 'paste' | 'preview'
const showHint = ref(false)
const copied = ref(false)

const AI_PROMPT = `Kamu adalah asisten yang mengekstrak soal ujian dari gambar.

Ekstrak semua soal pilihan ganda dari gambar ini dan ubah ke format JSON berikut:

{
  "exam": {
    "name": "[nama ujian, misal: UTS / UAS / Kuis]",
    "matkul": "[nama mata kuliah]",
    "semester": "[nomor semester]",
    "prodi": "[program studi]"
  },
  "questions": [
    {
      "id": 1,
      "question": "[teks soal]",
      "options": ["[pilihan A]", "[pilihan B]", "[pilihan C]", "[pilihan D]"],
      "answer": [index jawaban benar, mulai dari 0],
      "explanation": "[penjelasan singkat mengapa jawaban tersebut benar]"
    }
  ]
}

Aturan penting:
- "answer" adalah INDEX (angka), bukan huruf. A=0, B=1, C=2, D=3.
- Jika jawaban benar tidak tertera di soal, isi "answer": 0 dan aku akan koreksi manual.
- "explanation" isi dengan penjelasan singkat 1-2 kalimat. Jika tidak ada pembahasan di gambar, buat penjelasan sendiri berdasarkan pengetahuanmu.
- Jika field exam tidak ada di gambar, isi dengan tanda "-".
- Jangan tambahkan penjelasan apapun, output hanya JSON saja.
- Pastikan JSON valid dan bisa langsung dipakai.`

async function copyPrompt() {
  await navigator.clipboard.writeText(AI_PROMPT)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// ── parse & validate ──────────────────────────────────────────────────────────

const parsed = computed(() => {
  if (!raw.value.trim()) return null
  try {
    return JSON.parse(raw.value)
  } catch {
    return null
  }
})

const parseError = computed(() => {
  if (!raw.value.trim()) return null
  try {
    JSON.parse(raw.value)
    return null
  } catch (e) {
    return e.message
  }
})

const isValid = computed(() => {
  if (!parsed.value) return false
  const qs = Array.isArray(parsed.value)
    ? parsed.value
    : (parsed.value.questions ?? [])
  return qs.length > 0 && qs.every((q) => q.question && Array.isArray(q.options) && q.answer !== undefined)
})

const validationError = computed(() => {
  if (!raw.value.trim()) return null
  if (parseError.value) return `JSON tidak valid: ${parseError.value}`
  if (!isValid.value) {
    const qs = Array.isArray(parsed.value)
      ? parsed.value
      : (parsed.value?.questions ?? [])
    if (qs.length === 0) return 'Array "questions" kosong atau tidak ditemukan.'
    const bad = qs.find((q) => !q.question || !Array.isArray(q.options) || q.answer === undefined)
    if (bad) return `Soal id ${bad.id ?? '?'} tidak lengkap — butuh "question", "options", dan "answer".`
    return 'Format tidak dikenali.'
  }
  return null
})

// ── formatted preview with syntax highlighting ────────────────────────────────

const formattedJson = computed(() => {
  if (!parsed.value) return ''
  return JSON.stringify(parsed.value, null, 2)
})

// Colorize JSON tokens for the preview panel
function highlight(json) {
  // Escape HTML first
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        // key (followed by colon) vs string value
        return /:$/.test(match)
          ? `<span class="text-sky-400">${match}</span>`
          : `<span class="text-emerald-400">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span class="text-violet-400">${match}</span>`
      if (/null/.test(match))       return `<span class="text-red-400">${match}</span>`
      return `<span class="text-amber-400">${match}</span>` // number
    }
  )
}

const highlightedJson = computed(() => {
  if (!formattedJson.value) return ''
  return highlight(formattedJson.value)
})

// Switch to preview tab automatically once JSON becomes valid
watch(isValid, (v) => { if (v) activeTab.value = 'preview' })

// ── actions ───────────────────────────────────────────────────────────────────

function formatRaw() {
  if (parsed.value) raw.value = formattedJson.value
}

function save() {
  if (!isValid.value) return
  addCustomExam(parsed.value)
  emit('close')
}

function close() {
  emit('close')
}
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
    @click.self="close"
  >
    <!-- Modal panel — fixed height on mobile so paste & preview are always equal -->
    <div
      class="relative w-full sm:max-w-4xl bg-gray-950 rounded-t-2xl sm:rounded-2xl
             shadow-2xl flex flex-col h-[82vh] sm:h-[85vh] overflow-hidden"
    >

      <!-- ── Header ─────────────────────────────────────────────────────── -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
        <div>
          <h2 class="text-white font-bold text-base">Tambah Matkul</h2>
          <p class="text-gray-400 text-xs mt-0.5">Paste JSON soal ujian, lalu simpan</p>
        </div>
        <button
          class="text-gray-400 hover:text-white text-xl leading-none active:opacity-60 p-1"
          @click="close"
        >
          ✕
        </button>
      </div>

      <!-- ── AI Prompt hint ─────────────────────────────────────────────── -->
      <div class="shrink-0 border-b border-gray-800">
        <!-- Toggle row -->
        <button
          class="w-full flex items-center justify-between px-5 py-2.5 text-left
                 hover:bg-gray-900 active:bg-gray-800 transition-colors"
          @click="showHint = !showHint"
        >
          <span class="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <span>✦</span>
            Cara generate JSON dari foto soal (pakai AI)
          </span>
          <span class="text-gray-500 text-xs transition-transform duration-200"
            :class="showHint ? 'rotate-180' : ''">▼</span>
        </button>

        <!-- Collapsible content -->
        <div v-if="showHint" class="px-5 pb-4 flex flex-col gap-3">
          <p class="text-xs text-gray-400 leading-relaxed">
            Upload foto soal ke <span class="text-white font-medium">Claude AI</span> atau
            <span class="text-white font-medium">ChatGPT</span>, lalu copy-paste prompt di bawah ini.
            AI akan menghasilkan JSON yang siap di-paste.
          </p>

          <!-- Prompt box -->
          <div class="relative">
            <pre class="bg-gray-900 rounded-xl p-4 text-xs text-gray-300 font-mono
                        whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto
                        border border-gray-700">{{ AI_PROMPT }}</pre>

            <!-- Copy button -->
            <button
              class="absolute top-2 right-2 flex items-center gap-1.5 text-xs font-semibold
                     px-3 py-1.5 rounded-lg transition-colors"
              :class="copied
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'"
              @click="copyPrompt"
            >
              {{ copied ? '✓ Tersalin!' : 'Copy Prompt' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Tabs (mobile only) ──────────────────────────────────────────── -->
      <div class="flex sm:hidden border-b border-gray-800 shrink-0">
        <button
          :class="['flex-1 py-2.5 text-sm font-medium transition-colors',
            activeTab === 'paste' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-500']"
          @click="activeTab = 'paste'"
        >
          Paste JSON
        </button>
        <button
          :class="['flex-1 py-2.5 text-sm font-medium transition-colors',
            activeTab === 'preview' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-500']"
          @click="activeTab = 'preview'"
        >
          Preview
          <span v-if="isValid" class="ml-1 text-emerald-400 text-xs">✓</span>
          <span v-else-if="validationError" class="ml-1 text-red-400 text-xs">✗</span>
        </button>
      </div>

      <!-- ── Body: split layout ──────────────────────────────────────────── -->
      <!-- flex-1 + min-h-0 lets this div shrink and fill the remaining modal height -->
      <div class="flex-1 flex flex-col sm:flex-row min-h-0">

        <!-- Left / Paste panel -->
        <div
          class="flex-1 flex flex-col sm:flex-none sm:w-1/2 sm:border-r sm:border-gray-800 min-h-0"
          :class="activeTab !== 'paste' ? 'hidden sm:flex' : 'flex'"
        >
          <div class="flex items-center justify-between px-4 py-2 border-b border-gray-800 shrink-0">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Paste JSON</span>
            <button
              v-if="parsed"
              class="text-xs text-indigo-400 hover:text-indigo-300 font-medium active:opacity-60"
              @click="formatRaw"
            >
              Format ↓
            </button>
          </div>
          <!-- h-full makes the textarea fill the full panel height -->
          <textarea
            v-model="raw"
            spellcheck="false"
            placeholder='Paste JSON di sini…

{
  "exam": { "name": "UTS", "matkul": "…" },
  "questions": [
    {
      "id": 1,
      "question": "…",
      "options": ["A","B","C","D"],
      "answer": 0,
      "explanation": "…"
    }
  ]
}'
            class="flex-1 w-full bg-transparent text-gray-200 text-sm font-mono resize-none
                   p-4 focus:outline-none placeholder-gray-700 leading-relaxed
                   overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
          />
        </div>

        <!-- Right / Preview panel -->
        <div
          class="flex-1 flex flex-col sm:flex-none sm:w-1/2 min-h-0"
          :class="activeTab !== 'preview' ? 'hidden sm:flex' : 'flex'"
        >
          <div class="flex items-center justify-between px-4 py-2 border-b border-gray-800 shrink-0">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Preview</span>
            <span v-if="isValid" class="text-xs font-medium text-emerald-400">✓ Valid</span>
            <span v-else-if="validationError" class="text-xs font-medium text-red-400">✗ Error</span>
            <span v-else class="text-xs text-gray-600">Menunggu input…</span>
          </div>

          <!-- overflow-y-auto here so the preview scrolls independently -->
          <div class="flex-1 overflow-y-auto min-h-0">
            <div
              v-if="!raw.trim()"
              class="h-full flex items-center justify-center text-gray-700 text-sm text-center px-6"
            >
              Paste JSON di panel kiri untuk melihat preview di sini
            </div>
            <pre
              v-else
              class="p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words"
              v-html="highlightedJson || `<span class='text-red-400'>${raw}</span>`"
            />
          </div>
        </div>

      </div>

      <!-- ── Footer: error + actions ─────────────────────────────────────── -->
      <div class="shrink-0 border-t border-gray-800 px-5 py-4 flex flex-col gap-3">

        <!-- Validation error -->
        <p v-if="validationError" class="text-xs text-red-400 font-medium leading-snug">
          ⚠ {{ validationError }}
        </p>
        <p v-else-if="isValid" class="text-xs text-emerald-400 font-medium">
          ✓ {{ Array.isArray(parsed) ? parsed.length : (parsed?.questions?.length ?? 0) }} soal siap disimpan
        </p>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            class="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium
                   active:bg-gray-800 transition-colors"
            @click="close"
          >
            Batal
          </button>
          <button
            :disabled="!isValid"
            class="flex-1 py-3 rounded-xl text-sm font-bold transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed
                   bg-indigo-600 text-white active:bg-indigo-700"
            @click="save"
          >
            Simpan Matkul
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
