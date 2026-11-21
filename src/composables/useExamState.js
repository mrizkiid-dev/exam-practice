import { ref, computed } from 'vue'

// ── localStorage keys ─────────────────────────────────────────────────────────

const LS_CORRECTIONS_KEY = 'exam_answer_corrections_v2'
const LS_CUSTOM_EXAMS_KEY = 'exam_custom_exams'
const LS_REASON_MODE_KEY = 'exam_reason_mode'
const LS_COLUMNS_KEY = 'exam_columns'

// ── state ─────────────────────────────────────────────────────────────────────

// Semester folders from index.json: [{ id: 'semester4', semester: '4', files: [...] }]
const semesterIndex = ref([])

// File-based exams loaded from data/semesterN/*.json
// Each: { id: 'semester4/x.json', file, semesterId, exam, totalQuestions, isCustom: false }
const fileExamList = ref([])

// User-added exams stored in localStorage
// Each: { id: 'custom_xxx', exam: {}, questions: [], totalQuestions: n }
const customExamList = ref([])

// Combined list of every exam (file exams first, then custom)
const examList = computed(() => [...fileExamList.value, ...customExamList.value])

// Which semester the user is browsing (e.g. 'semester5'); null = semester picker
const activeSemester = ref(null)

// Currently open exam identifier: a data path (e.g. 'semester4/msim4309.json') or custom id
const activeFile = ref(null)

// Exam metadata and questions for the open exam
const examInfo = ref({})
const rawQuestions = ref([])

// Corrections per exam: { [examId]: { [questionId]: answerIndex } }
const allCorrections = ref({})

// Global drill settings
const answerMode = ref('hide')

// Whether the reason (explanation) under an answer is expanded by default.
// Persisted in localStorage; each card can still override it locally.
function loadReasonMode() {
  try { return localStorage.getItem(LS_REASON_MODE_KEY) === 'hide' ? 'hide' : 'show' } catch { return 'show' }
}
const reasonMode = ref(loadReasonMode())

// Layout: 1 or 2 question columns (2 = questions side by side: 1|2, 3|4, …).
// Persisted in localStorage. On small screens the grid always falls back to 1 column.
function loadColumns() {
  try { return localStorage.getItem(LS_COLUMNS_KEY) === '2' ? 2 : 1 } catch { return 1 }
}
const columns = ref(loadColumns())
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

/** Custom exams have no folder, so group them by their `exam.semester` field. */
function semesterIdOf(exam) {
  const n = String(exam?.semester ?? '').trim()
  return /^\d+$/.test(n) ? `semester${n}` : 'other'
}

// ── derived data ───────────────────────────────────────────────────────────────

/**
 * Semester cards for the home page. Folder-based semesters always appear
 * (even when empty); custom exams join their semester or create one.
 */
const semesterList = computed(() => {
  const map = new Map()
  const ensure = (id) => {
    if (!map.has(id)) {
      const n = id.replace('semester', '')
      map.set(id, { id, semester: id === 'other' ? null : n, label: id === 'other' ? 'Lainnya' : `Semester ${n}`, exams: [] })
    }
    return map.get(id)
  }
  semesterIndex.value.forEach((s) => ensure(s.id))
  examList.value.forEach((e) => ensure(e.semesterId).exams.push(e))

  // Numeric order; 'other' last
  return [...map.values()].sort((a, b) => (a.semester ?? Infinity) - (b.semester ?? Infinity))
})

const activeSemesterInfo = computed(() => semesterList.value.find((s) => s.id === activeSemester.value) ?? null)

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
  customExamList.value = loadCustomExams().map((e) => ({ ...e, semesterId: semesterIdOf(e.exam) }))

  const base = import.meta.env.BASE_URL
  const res = await fetch(`${base}data/index.json`)
  semesterIndex.value = await res.json()

  const files = semesterIndex.value.flatMap((s) => s.files.map((file) => ({ file, semesterId: s.id })))

  fileExamList.value = await Promise.all(
    files.map(async ({ file, semesterId }) => {
      const r = await fetch(`${base}data/${file}`)
      const data = await r.json()
      const exam = Array.isArray(data) ? {} : (data.exam ?? {})
      const qs   = Array.isArray(data) ? data : (data.questions ?? [])
      return { id: file, file, semesterId, exam, totalQuestions: qs.length, isCustom: false }
    })
  )

  migrateLegacyCorrections(fileExamList.value.map((e) => e.file))
}

/**
 * One-time migration: corrections used to be keyed by bare filename
 * ('msim4309.json'). Data now lives in semester folders, so move those
 * entries to the new path key ('semester4/msim4309.json').
 */
function migrateLegacyCorrections(paths) {
  const corr = { ...allCorrections.value }
  let changed = false
  for (const p of paths) {
    const legacy = p.split('/').pop()
    if (legacy !== p && corr[legacy] && !corr[p]) {
      corr[p] = corr[legacy]
      delete corr[legacy]
      changed = true
    }
  }
  if (changed) {
    allCorrections.value = corr
    saveAllCorrections(corr)
  }
}

/** Enter a semester to see its exams. */
function openSemester(id) { activeSemester.value = id }

/** Back to the semester picker. */
function closeSemester() { activeSemester.value = null }

/** Open a file-based exam. */
async function openExam(file) {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${file}`)
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
  customExamList.value = updated.map((e) => ({ ...e, semesterId: semesterIdOf(e.exam) }))
  saveCustomExams(updated.map(({ semesterId, ...rest }) => rest))
  return entry
}

/** Remove a custom exam from localStorage. */
function removeCustomExam(id) {
  const updated = customExamList.value.filter((e) => e.id !== id)
  customExamList.value = updated
  saveCustomExams(updated.map(({ semesterId, ...rest }) => rest))
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
function setReasonMode(mode) {
  reasonMode.value = mode
  try { localStorage.setItem(LS_REASON_MODE_KEY, mode) } catch { /* storage unavailable */ }
}
function setColumns(n) {
  columns.value = n === 2 ? 2 : 1
  try { localStorage.setItem(LS_COLUMNS_KEY, String(columns.value)) } catch { /* storage unavailable */ }
}
function setItemsPerPage(value) { itemsPerPage.value = value; currentPage.value = 0 }
function goToPage(index)        { currentPage.value = Math.max(0, Math.min(index, totalPages.value - 1)) }
function nextPage()             { goToPage(currentPage.value + 1) }
function prevPage()             { goToPage(currentPage.value - 1) }

// ── export ────────────────────────────────────────────────────────────────────

export function useExamState() {
  return {
    examList,
    semesterList,
    activeSemester,
    activeSemesterInfo,
    activeFile,
    examInfo,
    questions,
    pagedQuestions,
    answerMode,
    reasonMode,
    columns,
    itemsPerPage,
    currentPage,
    totalPages,
    drillSession,

    loadExamList,
    openSemester,
    closeSemester,
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
    setReasonMode,
    setColumns,
    setItemsPerPage,
    goToPage,
    nextPage,
    prevPage,
  }
}
