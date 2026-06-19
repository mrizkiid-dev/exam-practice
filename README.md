# Exam Practice SPA

A static single-page app for memorizing multiple-choice questions.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
npm run build    # production build
npm run preview  # preview production build
```

---

## Adding an Exam

### Step 1 — Create the JSON file

Create a new file inside `public/data/`, for example `algoritma.json`.

**Full structure:**

```json
{
  "exam": {
    "name": "Ujian Tengah Semester",
    "matkul": "Algoritma dan Pemrograman",
    "semester": "2",
    "prodi": "Teknik Informatika"
  },
  "questions": [
    {
      "id": 1,
      "question": "Apa yang dimaksud dengan algoritma?",
      "options": [
        "Bahasa pemrograman",
        "Urutan langkah logis untuk menyelesaikan masalah",
        "Struktur data",
        "Sistem operasi"
      ],
      "answer": 1
    },
    {
      "id": 2,
      "question": "Kompleksitas waktu Binary Search adalah?",
      "options": ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      "answer": 2,
      "explanation": "Binary search membagi ruang pencarian menjadi setengah di setiap langkah sehingga kompleksitasnya O(log n)."
    }
  ]
}
```

**Field reference:**

| Field | Wajib | Keterangan |
|---|---|---|
| `exam.name` | Tidak | Nama ujian, misal "UTS", "UAS". Tampil sebagai judul kartu. |
| `exam.matkul` | Tidak | Nama mata kuliah |
| `exam.semester` | Tidak | Nomor semester |
| `exam.prodi` | Tidak | Program studi |
| `questions[].id` | Ya | Angka unik untuk tiap soal (1, 2, 3, …) |
| `questions[].question` | Ya | Teks pertanyaan |
| `questions[].options` | Ya | Array 2–4 pilihan jawaban |
| `questions[].answer` | Ya | **Index jawaban benar (mulai dari 0)** |
| `questions[].explanation` | Tidak | Penjelasan jawaban — muncul sebagai kotak hijau setelah menjawab |

> Semua field `exam` boleh dihapus atau dikosongkan — app akan menampilkan `-`.

**Cara hitung `answer`:**

```
options: ["A", "B", "C", "D"]
index:     0    1    2    3

Jawaban benar = "C"  →  answer: 2
```

---

### Step 2 — Daftarkan file ke index

Buka `public/data/index.json` dan tambahkan nama file baru:

```json
["pemweb.json", "basis-data.json", "algoritma.json"]
```

Urutan di sini = urutan kartu di halaman utama.

---

## Cara Cepat: Generate JSON dari Foto Soal

Jika kamu punya foto / scan lembar soal ujian, kamu bisa pakai **Claude AI** atau **ChatGPT** untuk mengubahnya jadi JSON otomatis.

### Langkah-langkah

1. Buka [claude.ai](https://claude.ai) atau [chatgpt.com](https://chatgpt.com)
2. Upload foto soal ujian kamu
3. Copy-paste prompt di bawah ini, lalu kirim

---

### Prompt Template

```
Kamu adalah asisten yang mengekstrak soal ujian dari gambar.

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
- Jika field exam tidak ada di gambar, isi dengan "-".
- Jangan tambahkan penjelasan apapun, output hanya JSON saja.
- Pastikan JSON valid dan bisa langsung dipakai.
```

---

### Contoh hasil output AI

```json
{
  "exam": {
    "name": "Ujian Tengah Semester",
    "matkul": "Pemrograman Web",
    "semester": "4",
    "prodi": "Teknik Informatika"
  },
  "questions": [
    {
      "id": 1,
      "question": "Tag HTML yang digunakan untuk membuat tabel adalah?",
      "options": ["<div>", "<table>", "<section>", "<grid>"],
      "answer": 1
    },
    {
      "id": 2,
      "question": "Properti CSS untuk mengatur warna teks adalah?",
      "options": ["background-color", "font-size", "color", "border"],
      "answer": 2
    }
  ]
}
```

Simpan output AI sebagai file `.json` di `public/data/`, lalu daftarkan di `index.json`.

> **Tip:** Jika ada jawaban yang kamu ragu, biarkan saja — kamu bisa koreksi langsung di dalam app menggunakan fitur **"Edit answer key"** di tiap kartu soal.

---

## Struktur File

```
public/
└── data/
    ├── index.json        ← daftar semua file ujian
    ├── pemweb.json       ← satu file = satu ujian
    ├── basis-data.json
    └── [nama-ujian].json

src/
├── components/
│   ├── ExamListCard.vue  ← kartu di halaman utama
│   ├── QuestionCard.vue  ← tampilan tiap soal
│   ├── PaginationBar.vue
│   └── SettingsPanel.vue
├── composables/
│   └── useExamState.js   ← state global
└── App.vue
```

<!-- redeploy1 -->
