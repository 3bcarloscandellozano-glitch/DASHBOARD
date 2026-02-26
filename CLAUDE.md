# CLAUDE.md — DASHBOARD

## Project Overview

**DASHBOARD** is a single-file React academic dashboard visualizing linguistic research data about the **Thessalian dialect** found in the **Dodona oracle corpus** (ancient Greek inscriptions). It is a data-rich, interactive visualization tool aimed at scholarly use.

- **Primary language of the UI**: Spanish
- **Domain**: Ancient Greek dialectology / epigraphy
- **Corpus**: 4,438 total inscriptions; 81 Thessalian inscriptions (75 unique)

---

## Repository Structure

```
/home/user/DASHBOARD/
├── App.jsx       # The entire application (705 lines, single source file)
└── README.md     # Placeholder (empty)
```

There is **no build configuration**, **no package.json**, **no node_modules**, and **no test setup** in this repository. The project is intended to be dropped into an existing React host environment (e.g., Vite, Create React App, or a CodeSandbox/StackBlitz setup).

---

## Technology Stack

| Concern         | Technology                                    |
|-----------------|-----------------------------------------------|
| Framework       | React (functional components + hooks)         |
| Charts          | Recharts (Pie, Bar, Radar)                    |
| Styling         | Inline styles only (no CSS files or modules)  |
| State           | `useState`, `useEffect`, `useRef`             |
| Map             | Custom SVG (Thessaly map)                     |
| Fonts (assumed) | Playfair Display, DM Sans (loaded externally) |

**External dependencies** (not in this repo — must be available in host):
- `react`, `react-dom`
- `recharts`

---

## App.jsx Internal Structure

The file is divided into clearly labelled sections using decorative comment banners:

```
// ═══════════════════════════════════════════════════════════════
//  SECTION NAME
// ═══════════════════════════════════════════════════════════════
```

### Sections

| Section    | Lines      | Contents                                                     |
|------------|------------|--------------------------------------------------------------|
| DATA       | 8–97       | All hardcoded datasets (regions, corpus stats, chrono, themes, vowel notation, inscription examples) |
| HELPERS    | 100–118    | `Ref`, `RefList` — tiny components for rendering inscription references |
| PALETTE    | 120–144    | `C` object — centralized color constants                     |
| COMPONENTS | 146–318    | `Tip`, `Stat`, `Sec`, `Tag`, `ThessalyMap`                   |
| APP        | 320–705    | `export default function App()` — main shell, tab nav, chart layout |

---

## Key Data Structures

### `REGIONS` (array)
Four Thessalian geographic regions plus unassigned inscriptions:
```js
{ id, name, short, en, value, seguro, dudoso, nombre, chronoV, chronoVIV, noDate }
```
- `id`: one of `"general"`, `"pelasgiotis"`, `"histiaiotis"`, `"thessaliotis"`
- `value`: total inscriptions from that region
- `seguro` / `dudoso` / `nombre`: classification subcounts

### `VOWEL_NOTATION` (array)
Three categories of vowel notation systems with lists of inscription references (`dvcs`):
```js
{ type, n, desc, color, dvcs: [{ src, id }] }
```

### `VOWEL_EXAMPLES` (array)
Detailed inscription table (19 items):
```js
{ src, id, cat, date, region, form }
```
- `cat`: 1, 2, or 3 — maps to a `VOWEL_NOTATION` entry
- `form`: the specific linguistic form attested

### Constants
- `TOTAL_DIALECT` = 806 (total dialect inscriptions)
- `TOTAL_THESS` = 81 (Thessalian inscriptions in corpus)
- `TOTAL_THESS_UNIQUE` = 75 (unique Thessalian inscriptions)
- `TOTAL_CORPUS` = 4438 (total Dodona corpus)

---

## UI Structure / Tabs

The app has **three tabs** rendered via `useState`:

| Tab key   | Label (ES)               | Content                                                   |
|-----------|--------------------------|-----------------------------------------------------------|
| `map`     | Mapa y Distribución      | SVG map + region cards + PieChart + BarChart              |
| `profile` | Perfil Cronológico       | BarChart of chronological periods + THEMES RadarChart     |
| `vowels`  | Notación Vocálica        | Vowel notation PieChart + detailed inscription table      |

### State Variables in `App`
```js
const [tab, setTab] = useState("map");            // active tab
const [hovered, setHovered] = useState(null);     // hovered region id
const [selected, setSelected] = useState(null);   // selected region id
const [ready, setReady] = useState(false);        // fade-in animation flag
```

---

## Component Inventory

| Component      | Props                         | Purpose                                          |
|----------------|-------------------------------|--------------------------------------------------|
| `Ref`          | `{ src, id, style }`          | Renders italic inscription citation              |
| `RefList`      | `{ dvcs }`                    | Comma-separated list of `Ref` components         |
| `Tip`          | `{ active, payload, label }`  | Custom Recharts tooltip                          |
| `Stat`         | `{ label, value, sub, color }`| A labeled statistic block                        |
| `Sec`          | `{ title, children, style }`  | Section wrapper with title and styled card       |
| `Tag`          | `{ active, onClick, children }`| Tab/filter button with active state styling     |
| `ThessalyMap`  | `{ hovered, selected, onHover, onSelect }` | Interactive SVG map of Thessaly  |

---

## Color Palette (`C` object)

All colors are centralized in the `C` constant. Never use raw hex colors outside of `C` or `VOWEL_NOTATION`.

```js
C.bg        // #f5f0e8  — page background (parchment)
C.card      // rgba(...)— card background
C.border    // rgba(...)— card borders
C.gold      // #8b6914  — primary accent
C.amber     // #a06a10  — secondary accent
C.terra     // #a54030  — red/terra accent
C.green     // #2e7d46  — green accent
C.blue      // #2a6a8e  — blue accent
C.muted     // #7a7060  — muted text
C.text      // #3a352e  — main text
C.dim       // #9a9080  — dimmed text
C.heading   // #2c2720  — headings
C.regions   // { general, pelasgiotis, histiaiotis, thessaliotis, phthiotis }
```

---

## Code Conventions

### Styling
- **All styles are inline** using JavaScript style objects — no CSS files, no CSS modules, no Tailwind.
- Colors come from the `C` palette object.
- Font families are referenced via CSS custom properties `var(--fh)` (heading) and `var(--fb)` (body), which must be defined in the host HTML/CSS.
- Flexbox is the primary layout mechanism.

### Component patterns
- **Functional components only** — no class components.
- Props are **destructured** in function signatures.
- **Conditional rendering** uses ternary operators, not `&&` chaining where possible.
- `key` props use array indices (`i`) for small, static lists.

### Data conventions
- All data is **hardcoded** — there is no API or data fetching.
- Spanish is the primary label language; English translations are provided in data objects via an `en` field where applicable.
- Inscription references follow the format: *I. Dodone [source] [id]* (e.g., *I. Dodone DVC 31A*).
- Sources are either `"DVC"` or `"Lhôte"`.

### Comment style
- Section headers use `═` box-drawing characters.
- Inline comments use standard `//` style.
- Do not remove or alter section header comments — they serve as structural navigation markers.

---

## Git Workflow

- **Remote**: `http://local_proxy@127.0.0.1:62338/git/3bcarloscandellozano-glitch/DASHBOARD`
- **Main branch**: `master`
- **Development branches**: follow the pattern `claude/<session-id>` for AI-assisted work
- Always push using: `git push -u origin <branch-name>`
- Keep commit messages clear and descriptive

---

## What This Project Does NOT Have

Be aware of these **intentional absences** — do not add them without explicit instruction:

- No `package.json` or lockfiles
- No TypeScript (`tsconfig.json`)
- No ESLint or Prettier configuration
- No CSS files, stylesheets, or Tailwind
- No test suite (Jest, Vitest, etc.)
- No build config (Vite, Webpack, etc.)
- No CI/CD pipelines
- No `.env` or environment variables
- No routing (React Router, etc.)
- No global state management (Redux, Zustand, Context API)

---

## Development Guidelines for AI Assistants

1. **Do not split** `App.jsx` into multiple files unless explicitly asked — the single-file architecture is intentional.
2. **Preserve the section structure** (DATA / HELPERS / PALETTE / COMPONENTS / APP) when adding new code.
3. **Add new data constants** near the top DATA section; add new components before the APP section.
4. **Use `C` palette** for all colors. Do not introduce raw hex values outside of data objects.
5. **Keep inline styles** — do not introduce CSS files or class-based styling.
6. **Spanish first**: UI labels and text should be in Spanish unless the existing code uses English.
7. **Do not add dependencies** beyond `react` and `recharts` without explicit instruction.
8. **Preserve inscription reference format** — always use the `Ref` / `RefList` components for citations.
9. When adding new chart types, import only the Recharts components you need (tree-shakeable imports at the top of the file).
10. **Test visually** — there is no automated test suite. Changes should be verified by rendering the component in a React environment.
