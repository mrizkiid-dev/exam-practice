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

Create a new file inside the semester folder `public/data/semesterN/`, for example `public/data/semester5/algoritma.json`. To add a new semester, just create a new `semesterN` folder.

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

### Step 2 — Index otomatis

Tidak perlu edit apa pun. `public/data/index.json` dibuat otomatis oleh plugin Vite (saat `npm run dev` dan `npm run build`) dengan memindai semua folder `semesterN/`. Halaman utama menampilkan kartu per semester; semester terbaru ditandai **Sekarang**.

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

Simpan output AI sebagai file `.json` di `public/data/semesterN/` (index dibuat otomatis).

> **Tip:** Jika ada jawaban yang kamu ragu, biarkan saja — kamu bisa koreksi langsung di dalam app menggunakan fitur **"Edit answer key"** di tiap kartu soal.

---

## Menambah Materi (Catatan ala Obsidian)

Selain latihan soal, app punya bagian **Materi** untuk membaca catatan / bahan ajar per mata kuliah. Buka lewat tab **Materi** di halaman utama, atau langsung ke `http://localhost:5173/#/notes`.

### Langkah-langkah

1. Buat folder per mata kuliah di `public/notes/` dengan format `<KODE> <Nama Matkul>`.
2. Taruh file `.md` di dalamnya. Nama file = judul yang tampil di sidebar.

```
public/notes/
├── MSIM4202 Struktur Data/
│   └── Bahan Ajar Persiapan UAS.md
└── MSIM4308 Administrasi Server/
    └── Bahan Ajar Persiapan UAS.md
```

Selesai — `public/notes/index.json` dibuat otomatis (jangan diedit). Saat `npm run dev` jalan, menambah atau mengedit file `.md` langsung me-refresh halaman.

**Tips:**
- Nama file pakai spasi dan huruf rapi (`Bahan Ajar Persiapan UAS.md`, bukan `bahan_ajar_uas.md`).
- Boleh pakai subfolder (mis. `MSIM4202 Struktur Data/Modul 1/`).
- File/folder berawalan `.` atau `_` disembunyikan dari app.

### Markdown yang didukung

| Fitur | Contoh |
| :--- | :--- |
| Tabel, list, blockquote, **bold**, *italic* | Markdown standar (GitHub-flavoured) |
| Kode dengan warna | ` ```java `, ` ```bash `, ` ```python `, … |
| Rumus matematika (KaTeX) | `$O(n \log n)$` atau blok `$$ ... $$` |
| Link antar catatan | `[[Nama Catatan]]`, `[[Nama Catatan\|teks]]`, `[[Nama Catatan#Judul]]` |
| Daftar isi otomatis | dari judul `#`, `##`, `###` |

---

## Pakai AI Assistant untuk Menambah Konten

Project ini punya file [`AGENTS.md`](AGENTS.md) — instruksi yang otomatis dibaca oleh AI coding assistant (Claude Code, Codex, Cursor, GitHub Copilot, Windsurf, dll). Jadi kamu cukup memberi perintah singkat, dan AI tahu harus menyimpan file di mana dan dengan format apa.

### Contoh perintah

| Kamu ketik | Yang dilakukan AI |
| :--- | :--- |
| "tolong buatkan ini untuk struktur data" + tempel markdown | Simpan ke `public/notes/MSIM4202 Struktur Data/<Judul>.md` |
| "materi ini untuk adm server" + lampirkan file `.md` | Simpan ke `public/notes/MSIM4308 Administrasi Server/<Judul>.md` |
| "tambahkan soal ini ke komunikasi bisnis" + tempel soal | Tambahkan ke `public/data/semester5/skom4432.json` (format JSON + `answer` mulai 0) |

Yang otomatis diurus AI (sesuai `AGENTS.md`):
- Mencari kode matkul dari nama pendek ("adm server" → `MSIM4308`).
- Menyalin isi materi apa adanya (tidak diringkas/diubah kecuali diminta).
- Bertanya dulu sebelum menimpa file yang sudah ada.
- Menjalankan `npm run build` untuk memastikan semuanya valid.

> **Catatan:** Claude Code membaca `CLAUDE.md`, yang sudah meng-import `AGENTS.md`. Gemini CLI default-nya membaca `GEMINI.md` — set `contextFileName` ke `AGENTS.md` di setting Gemini kalau mau memakainya.
>
> Kalau ada matkul atau aturan baru, cukup edit **`AGENTS.md`** — semua AI ikut membaca perubahannya.

---

## Struktur File

```
public/
├── data/
│   ├── index.json        ← otomatis (jangan diedit)
│   ├── semester4/
│   │   ├── msim4309.json ← satu file = satu ujian
│   │   └── ...
│   └── semester5/
│       └── [nama-ujian].json
└── notes/
    ├── index.json        ← otomatis (jangan diedit)
    └── MSIM4202 Struktur Data/
        └── Bahan Ajar Persiapan UAS.md   ← satu folder = satu matkul

src/
├── components/
│   ├── SemesterCard.vue  ← kartu semester di halaman utama
│   ├── ExamListCard.vue  ← kartu matkul per semester
│   ├── QuestionCard.vue  ← tampilan tiap soal
│   ├── PaginationBar.vue
│   ├── SettingsPanel.vue
│   ├── NotesView.vue     ← halaman Materi (sidebar, isi, daftar isi)
│   └── NoteTree.vue      ← pohon folder/file di sidebar
├── composables/
│   ├── useExamState.js   ← state global latihan soal
│   └── useNotes.js       ← state + routing Materi (#/notes/...)
├── utils/
│   └── markdown.js       ← renderer markdown (KaTeX, highlight, [[wikilink]])
└── App.vue

AGENTS.md                 ← instruksi untuk semua AI assistant
CLAUDE.md                 ← spesifikasi project (meng-import AGENTS.md)
```

<!-- redeploy1 -->
