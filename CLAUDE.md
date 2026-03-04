# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Type-check (vue-tsc) + production build
npm run preview    # Preview production build
```

No lint or test scripts are configured.

## Architecture

**FisioApp** is a fully client-side Vue 3 + TypeScript + Vite PWA for physiotherapy clinic management. All data is persisted to `localStorage` — there is no backend.

### Core Entities (`src/types/index.ts`)

- **Patient** — contact info, medical history, photos (base64 strings)
- **Appointment** — date/time, patient link, status (`pending` | `confirmed` | `completed` | `cancelled`)
- **Session** — post-treatment record (date, duration, treatment type, notes), linked to a patient

### State Management (`src/stores/`)

Three Pinia stores (patients, appointments, sessions), each using the Composition API style. All stores persist to `localStorage` via internal `load()`/`save()` helpers. IDs are generated with `crypto.randomUUID()`.

### Views (`src/views/`)

| View | Route | Purpose |
|------|-------|---------|
| `AgendaView` | `/` | Day-by-day appointment schedule; status cycling on click |
| `PatientsView` | `/patients` | Patient list with search by name/lastname/DNI |
| `PatientDetailView` | `/patients/:id` | Patient edit, photo gallery (FileReader → base64), sessions |
| `SessionsView` | `/sessions` | All sessions across patients |
| `ReportsView` | `/reports` | Stats dashboard with per-patient summary; print support |

### Layout

`App.vue` renders a sidebar nav on tablet/desktop and a bottom nav bar on mobile. Routing is defined in `src/router/index.ts`.

### Key Patterns

- **Path alias:** `@/` maps to `src/`
- **Styling:** Tailwind CSS with a custom `primary` blue palette (`#2563eb` base)
- **PWA:** Configured via `vite-plugin-pwa` with Workbox for offline caching
- **Language:** UI is entirely in Spanish
