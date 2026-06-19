# Project: Exam Memorization SPA

## Role & Context
You are an expert Frontend Developer building a **pure static single-page application (SPA)** that helps users memorize multiple-choice questions for exam practice.

The app is 100% client-side: no backend, no API. Questions come from a static JSON file, and all user data (answer corrections, settings) lives in `localStorage`.

## Tech Stack
- **Vue.js** — Composition API with `<script setup>`
- **Tailwind CSS** — all styling, must be responsive (mobile-first)
- **Data source** — a single static JSON file fetched on load

## Directory Architecture
```
├── public/
│   └── data/
│       └── questions.json       # The static source of truth
├── src/
│   ├── components/
│   │   ├── QuestionCard.vue     # Individual question display + validation
│   │   ├── PaginationBar.vue    # Pagination + items-per-page controls
│   │   └── SettingsPanel.vue    # Toggles: show/hide answer, items per page
│   ├── composables/
│   │   └── useExamState.js      # Global state: data, localStorage, settings
│   ├── App.vue                  # Main layout + state initialization
│   └── main.js
└── package.json
```

## Core Features

### 1. Data Ingestion & Answer-Key Override (Crucial)
- Fetch questions from `public/data/questions.json` on mount.
- Users can **correct** an answer key when they believe the JSON is wrong.
- Save corrections in `localStorage` (keyed per question).
- **Resolution priority when evaluating an answer:**
  1. Use the user's corrected answer from `localStorage` if it exists.
  2. Otherwise fall back to the original JSON answer.
- Provide a **"Reset to Original"** button that clears corrections from `localStorage` and reverts to the JSON data.

### 2. Memorization & Drill Modes
- **Show/Hide Answer Key** — a global toggle:
  - **Show:** the correct answer is highlighted immediately, before any click.
  - **Hide:** the user must select an option to reveal feedback.
- **Validation (Hide mode):** when the user clicks an option, check it against the *active* answer key immediately:
  - Selected option turns **green** if correct.
  - Selected option turns **red** if incorrect, and the actual correct answer is highlighted.

### 3. Pagination & Batching
- A dropdown to choose questions per page: **2, 5, 7, 10, or "All"**.
- Standard **Next / Previous** controls driven by that selection.

## Expected JSON Shape
> Confirm/adjust against the real `questions.json`.
```json
[
  {
    "id": 1,
    "question": "Question text…",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0
  }
]
```

## Implementation Order
1. **`useExamState.js`** — fetch JSON, merge with `localStorage` overrides, manage pagination + settings state.
2. **`App.vue`** — clean, centered Tailwind layout with a settings header.
3. **`QuestionCard.vue`** — cleanly separate the **drill view** from the **edit-answer-key view**.

## Conventions
- Keep all Tailwind classes responsive (mobile-friendly).
- Comment code clearly, especially the answer-resolution and localStorage logic.
- Keep components focused; lift shared state into `useExamState.js`.
