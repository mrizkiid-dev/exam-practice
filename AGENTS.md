# AGENTS.md — Panduan untuk AI Assistant

File ini dibaca oleh semua AI coding assistant (Claude Code, Codex, Cursor, Copilot, Gemini, dll).
Isinya: cara menangani permintaan **konten** di project ini. Pemilik project biasanya memberi
perintah singkat seperti:

> "tolong buatkan ini untuk Struktur Data" + (tempel isi markdown / soal)

Ikuti alur di bawah tanpa perlu bertanya lagi, kecuali mata kuliahnya benar-benar tidak bisa ditentukan.

---

## Gambaran project

SPA statis (Vue 3 + Tailwind + Vite) untuk persiapan ujian Universitas Terbuka (UT). Ada dua bagian:

| Bagian | Isi | Lokasi data |
| :--- | :--- | :--- |
| **Latihan Soal** | Soal pilihan ganda per matkul (JSON) | `public/data/semesterN/<kode>.json` |
| **Materi** | Catatan / bahan ajar per matkul (Markdown, mirip Obsidian) | `public/notes/<KODE Nama Matkul>/*.md` |

Tidak ada backend. Semua file index (`public/data/index.json`, `public/notes/index.json`) dibuat
**otomatis** oleh plugin Vite — **jangan pernah membuat atau mengedit file index secara manual.**

---

## Langkah 1 — Tentukan mata kuliahnya

User sering menyebut nama pendek ("struktur data", "adm server", "komunikasi bisnis").
Cocokkan ke kode resmi dengan cara:

1. Lihat folder yang sudah ada di `public/notes/` — kalau sudah ada folder matkul itu, pakai folder tersebut.
2. Kalau belum ada, cari kodenya di field `exam.matkul` pada `public/data/*/*.json`:
   ```bash
   grep -h '"matkul"' public/data/*/*.json
   ```
3. Kalau tetap tidak ketemu, tanya user kode matkulnya (format UT: 4 huruf + 4 angka, mis. `MSIM4202`).

Daftar matkul yang sudah dikenal (per saat file ini ditulis):

| Kode | Nama | Semester |
| :--- | :--- | :--- |
| MSIM4202 | Struktur Data | 5 |
| MSIM4303 | Rekayasa Perangkat Lunak | 5 |
| MSIM4308 | Administrasi Server | 5 |
| MSIM4401 | Pemrograman Berbasis Perangkat Bergerak | 5 |
| ADPU4341 | Teori Organisasi | 5 |
| BING4121 | Basic Reading | 5 |
| SATS4121 | Metode Statistika 1 | 5 |
| SKOM4432 | Komunikasi Bisnis | 5 |
| MSIM4207 | Sistem Informasi Manajemen | 4 |
| MSIM4309 | Pemrograman Berbasis Web | 4 |
| MSIM4310 | Analisis dan Visualisasi Data | 4 |
| EKMA4158 | Perilaku Organisasi | 4 |
| STSI4206 | Proses Bisnis | 4 |
| STSI4204 | (file `stsi4204.json`, judul di JSON: "Analisis dan Visualisasi Data (A1)") | 4 |
| — | Kewirausahaan di Era Digital (file `kewirausahaan.json`, belum ada kode) | 4 |

---

## Langkah 2a — Kalau yang diberikan adalah MATERI (markdown / teks bahan ajar)

Simpan sebagai file `.md`:

```
public/notes/<KODE> <Nama Matkul>/<Judul Catatan>.md
```

Contoh: `public/notes/MSIM4202 Struktur Data/Bahan Ajar Persiapan UAS.md`

Aturan:
- **Nama folder** = `<KODE> <Nama Matkul>` persis, pakai spasi (mis. `MSIM4308 Administrasi Server`).
  Satu folder per mata kuliah; boleh ada subfolder (mis. `Modul 1/`).
- **Nama file** = judul yang mudah dibaca, pakai spasi, tanpa tanggal/underscore
  (`bahan_ajar_persiapan_uas.md` → `Bahan Ajar Persiapan UAS.md`). Nama file inilah yang tampil di sidebar.
- **Salin isi apa adanya** (verbatim). Jangan meringkas, menerjemahkan, atau "memperbaiki" isi kecuali diminta.
- Kalau file dengan nama sama sudah ada, **tanya dulu** apakah ditimpa atau dibuat nama baru
  (mis. `Bahan Ajar Persiapan UAS 2.md`).
- Awalan `.` atau `_` pada nama file/folder membuatnya disembunyikan dari app.

Markdown yang didukung renderer (`src/utils/markdown.js`):
- GitHub-flavoured markdown: tabel, list, blockquote, code block dengan bahasa (` ```java `, ` ```bash `, …)
- Rumus KaTeX: `$O(n \log n)$` (inline) dan `$$ ... $$` (blok)
- Link antar catatan gaya Obsidian: `[[Nama Catatan]]`, `[[Nama Catatan|teks]]`, `[[Nama Catatan#Judul]]`
- Link relatif ke `.md` lain: `[teks](../Folder Lain/Catatan.md)`
- Judul `#`, `##`, `###` otomatis jadi "Daftar isi"

## Langkah 2b — Kalau yang diberikan adalah SOAL (pilihan ganda)

Simpan sebagai JSON di `public/data/semesterN/<kode-kecil>.json` (mis. `public/data/semester5/msim4202.json`).
Kalau file matkul itu sudah ada, **tambahkan** soal ke array `questions` (lanjutkan `id`), jangan menimpa.

```json
{
  "exam": {
    "source": "URL sumber soal (opsional)",
    "name": "Ujian Akhir Semester",
    "matkul": "MSIM4202 Struktur Data",
    "semester": "5",
    "prodi": "Teknik Informatika"
  },
  "questions": [
    {
      "id": 1,
      "question": "Teks pertanyaan…",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "answer": 3,
      "explanation": "Alasan singkat kenapa jawabannya benar (opsional tapi dianjurkan)."
    }
  ]
}
```

- `answer` = **index mulai dari 0** (A=0, B=1, C=2, D=3).
- `id` unik dan berurutan dalam satu file.
- Lihat `README.md` untuk referensi field lengkap.

---

## Langkah 3 — Verifikasi

```bash
npm run build
```

Build harus sukses, dan file baru harus muncul di `public/notes/index.json` atau `public/data/index.json`
(dibuat otomatis oleh build). Kalau dev server (`npm run dev`) sedang jalan, halaman otomatis reload.

Link langsung ke catatan: `http://localhost:5173/#/notes/<Folder>/<Nama Catatan tanpa .md>`
(spasi di-encode jadi `%20`).

Jangan commit kecuali user memintanya.

---

## Untuk perubahan kode

- Stack: Vue 3 `<script setup>` + Tailwind (mobile-first) + Vite. Lihat `CLAUDE.md` untuk spesifikasi fitur Latihan Soal.
- Bagian Materi: `src/composables/useNotes.js` (state + routing hash `#/notes/...`),
  `src/components/NotesView.vue` + `NoteTree.vue` (UI), `src/utils/markdown.js` (renderer, di-lazy-load).
- Plugin index otomatis ada di `vite.config.js` (`examAutoIndex`, `notesAutoIndex`).
