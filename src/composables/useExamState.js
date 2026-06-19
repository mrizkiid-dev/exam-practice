import { ref, computed } from 'vue'

// ── localStorage keys ─────────────────────────────────────────────────────────

const LS_CORRECTIONS_KEY = 'exam_answer_corrections_v2'
const LS_CUSTOM_EXAMS_KEY = 'exam_custom_exams'

// ── state ─────────────────────────────────────────────────────────────────────

// File-based exams loaded from index.json
const fileExamList = ref([])

// User-added exams stored in localStorage
// Each: { id: 'custom_xxx', exam: {}, questions: [], totalQuestions: n }
const customExamList = ref([])

// Combined list shown on the home page (file exams first, then custom)
const examList = computed(() => [...fileExamList.value, ...customExamList.value])

// Currently open exam identifier: a filename (e.g. 'pemweb.json') or custom id
const activeFile = ref(null)

// Exam metadata and questions for the open exam
const examInfo = ref({})
const rawQuestions = ref([])

// Corrections per exam: { [examId]: { [questionId]: answerIndex } }
const allCorrections = ref({})

// Global drill settings
const answerMode = ref('hide')
const itemsPerPage = ref('10')
const currentPage = ref(0)

// Bumping this tells every QuestionCard to reset its selected drill answer
const drillSession = ref(0)

// ── localStorage helpers ───────────────────────────────────────────────────────

function loadAllCorrections() {
  try { return JSON.parse(localStorage.getItem(LS_CORRECTIONS_KEY)) ?? {} } catch { return {} }
}

function saveAllCorrections(data) {
  localStorage.setItem(LS_CORRECTIONS_KEY, JSON.stringify(data))
}

function loadCustomExams() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM_EXAMS_KEY)) ?? [] } catch { return [] }
}

function saveCustomExams(list) {
  localStorage.setItem(LS_CUSTOM_EXAMS_KEY, JSON.stringify(list))
}

function makeId() {
  return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ── derived data ───────────────────────────────────────────────────────────────

const corrections = computed(() => allCorrections.value[activeFile.value] ?? {})

const questions = computed(() =>
  rawQuestions.value.map((q) => ({
    ...q,
    activeAnswer: corrections.value[q.id] !== undefined ? corrections.value[q.id] : q.answer,
    isCorrected: corrections.value[q.id] !== undefined,
  }))
)

const totalPages = computed(() => {
  if (itemsPerPage.value === 'all') return 1
  return Math.ceil(questions.value.length / Number(itemsPerPage.value))
})

const pagedQuestions = computed(() => {
  if (itemsPerPage.value === 'all') return questions.value
  const size = Number(itemsPerPage.value)
  return questions.value.slice(currentPage.value * size, (currentPage.value + 1) * size)
})

// ── actions ────────────────────────────────────────────────────────────────────

/** Boot: fetch file-based exams + load custom exams from localStorage. */
async function loadExamList() {
  allCorrections.value = loadAllCorrections()
  customExamList.value = loadCustomExams()

  const res = await fetch('/data/index.json')
  const files = await res.json()

  fileExamList.value = await Promise.all(
    files.map(async (file) => {
      const r = await fetch(`/data/${file}`)
      const data = await r.json()
      const exam = Array.isArray(data) ? {} : (data.exam ?? {})
      const qs   = Array.isArray(data) ? data : (data.questions ?? [])
      return { id: file, file, exam, totalQuestions: qs.length, isCustom: false }
    })
  )
}

/** Open a file-based exam. */
async function openExam(file) {
  const res = await fetch(`/data/${file}`)
  const data = await res.json()
  rawQuestions.value = Array.isArray(data) ? data : (data.questions ?? [])
  examInfo.value      = Array.isArray(data) ? {} : (data.exam ?? {})
  activeFile.value    = file
  currentPage.value   = 0
  drillSession.value++
}

/** Open a custom (localStorage) exam by id. */
function openCustomExam(id) {
  const entry = customExamList.value.find((e) => e.id === id)
  if (!entry) return
  rawQuestions.value = entry.questions
  examInfo.value     = entry.exam ?? {}
  activeFile.value   = id
  currentPage.value  = 0
  drillSession.value++
}

/**
 * Save a new custom exam from a parsed JSON object.
 * Returns the new entry so the caller can react.
 */
function addCustomExam(parsedData) {
  const exam      = parsedData.exam ?? {}
  const questions = Array.isArray(parsedData) ? parsedData : (parsedData.questions ?? [])
  const entry = { id: makeId(), exam, questions, totalQuestions: questions.length, isCustom: true }
  const updated = [...customExamList.value, entry]
  customExamList.value = updated
  saveCustomExams(updated)
  return entry
}

/** Remove a custom exam from localStorage. */
function removeCustomExam(id) {
  const updated = customExamList.value.filter((e) => e.id !== id)
  customExamList.value = updated
  saveCustomExams(updated)
  // Also drop any corrections for it
  const corr = { ...allCorrections.value }
  delete corr[id]
  allCorrections.value = corr
  saveAllCorrections(corr)
}

/** Go back to the list page. */
function closeExam() {
  activeFile.value = null
  rawQuestions.value = []
  examInfo.value = {}
}

function setCorrection(questionId, answerIndex) {
  const file = activeFile.value
  const updated = { ...allCorrections.value, [file]: { ...(allCorrections.value[file] ?? {}), [questionId]: answerIndex } }
  allCorrections.value = updated
  saveAllCorrections(updated)
}

function resetCorrection(questionId) {
  const file = activeFile.value
  const fc = { ...(allCorrections.value[file] ?? {}) }
  delete fc[questionId]
  const updated = { ...allCorrections.value, [file]: fc }
  allCorrections.value = updated
  saveAllCorrections(updated)
}

function resetAllCorrections() {
  const updated = { ...allCorrections.value, [activeFile.value]: {} }
  allCorrections.value = updated
  saveAllCorrections(updated)
}

function resetAllAnswers() { drillSession.value++ }

function setAnswerMode(mode)    { answerMode.value = mode }
function setItemsPerPage(value) { itemsPerPage.value = value; currentPage.value = 0 }
function goToPage(index)        { currentPage.value = Math.max(0, Math.min(index, totalPages.value - 1)) }
function nextPage()             { goToPage(currentPage.value + 1) }
function prevPage()             { goToPage(currentPage.value - 1) }

// ── export ────────────────────────────────────────────────────────────────────

export function useExamState() {
  return {
    examList,
    activeFile,
    examInfo,
    questions,
    pagedQuestions,
    answerMode,
    itemsPerPage,
    currentPage,
    totalPages,
    drillSession,

    loadExamList,
    openExam,
    openCustomExam,
    addCustomExam,
    removeCustomExam,
    closeExam,
    setCorrection,
    resetCorrection,
    resetAllCorrections,
    resetAllAnswers,
    setAnswerMode,
    setItemsPerPage,
    goToPage,
    nextPage,
    prevPage,
  }
}
