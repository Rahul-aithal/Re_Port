# BNMIT Report Generator

A full-stack web application that lets students fill in a multi-step form, stores the data in MongoDB, injects it into the official BNMIT Typst report template, and compiles a downloadable PDF report.

---

## Project Structure

```
bnmit-report-generator/
│
├── package.json                  ← root scripts (runs both simultaneously)
│
├── backend/
│   ├── server.js                 ← Express entry point
│   ├── package.json
│   ├── .env.example              ← copy to .env and edit
│   ├── models/
│   │   └── Report.js             ← Mongoose schema (all template fields)
│   ├── routes/
│   │   └── reports.js            ← REST API routes
│   ├── services/
│   │   └── typstGenerator.js     ← Injects data → writes .typ files → compiles PDF
│   ├── middleware/
│   │   └── validate.js           ← express-validator rules
│   └── outputs/                  ← generated PDFs live here (auto-created)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               ← main orchestrator (form + navigation)
│       ├── index.css             ← global styles + CSS variables
│       ├── components/
│       │   ├── UI.jsx            ← reusable Input, Textarea, Select, Button, Card...
│       │   ├── Stepper.jsx       ← progress indicator
│       │   ├── StepProject.jsx   ← Step 1: title, subject, semester
│       │   ├── StepAuthors.jsx   ← Step 2: 1-4 authors with name + USN
│       │   ├── StepGuide.jsx     ← Step 3: guide + department + HOD
│       │   ├── StepAbstract.jsx  ← Step 4: abstract with word count
│       │   ├── StepChapters.jsx  ← Step 5: 6 chapters in accordion
│       │   ├── StepReferences.jsx← Step 6: Hayagriva YAML citations
│       │   └── ResultScreen.jsx  ← success/failure after submission
│       ├── pages/
│       │   └── HistoryPage.jsx   ← list all past reports, download, delete
│       └── utils/
│           ├── api.js            ← all fetch() calls to backend
│           └── constants.js      ← departments, semester words, step defs, empty form
│
└── bnmit-typst-report-template/  ← YOUR template folder (place here, see below)
    ├── main.typ
    ├── template.typ
    ├── template-images/
    └── ...
```

---

## Prerequisites

| Tool    | Install |
|---------|---------|
| Node.js ≥ 18 | https://nodejs.org |
| MongoDB ≥ 6  | https://www.mongodb.com/try/download/community |
| Typst (latest) | https://github.com/typst/typst/releases — download binary and add to PATH |

### Fonts required by the template
| Font | Notes |
|------|-------|
| Times New Roman | Usually pre-installed on Windows/macOS. On Ubuntu: `sudo apt install ttf-mscorefonts-installer` |
| Calibri | Pre-installed on Windows. Copy from Windows into `~/.local/share/fonts/` on Linux |
| English111 Vivace BT | Decorative font for the BNMIT heading. Install manually |

> **Tip**: If fonts are missing, Typst will warn but may still compile with fallbacks.

---

## Setup

### 1. Place the Typst template

Unzip `bnmit-typst-report-template` so the folder sits at:

```
bnmit-report-generator/
└── bnmit-typst-report-template/   ← HERE
    ├── main.typ
    ├── template.typ
    ├── template-images/
    └── [1] preamble/ ...
```

### 2. Install dependencies

```bash
# From the project root:
npm run install:all
```

Or manually:
```bash
cd backend  && npm install
cd frontend && npm install
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bnmit_reports
FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Or just run: mongod
```

### 5. Run in development

```bash
# From root — starts both backend (5000) and frontend (5173) together:
npm run dev
```

Or separately:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open: **http://localhost:5173**

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | Server + DB status |
| `POST` | `/api/reports` | Create report + generate PDF |
| `GET`  | `/api/reports` | List all reports (paginated) |
| `GET`  | `/api/reports/:id` | Get full report |
| `PUT`  | `/api/reports/:id` | Update + regenerate |
| `POST` | `/api/reports/:id/regenerate` | Re-compile PDF without changing data |
| `DELETE` | `/api/reports/:id` | Delete report + files |
| `GET`  | `/outputs/:id/report.pdf` | Download generated PDF |

### POST /api/reports — Request Body

```json
{
  "title": "Smart Attendance System",
  "subject": "Mini Project",
  "subjectCode": "21CSL66",
  "year": "2025-26",
  "semesterNumber": 5,
  "semesterWord": "Fifth",
  "section": "A",
  "authors": [
    { "name": "Riya Sharma", "usn": "1BG23CS042" },
    { "name": "Arun Kumar",  "usn": "1BG23CS018" }
  ],
  "guide": {
    "name": "Dr. Priya Nair",
    "designation": "Professor",
    "departmentAbbr": "CSE",
    "departmentFull": "Computer Science and Engineering"
  },
  "departmentName": "Computer Science and Engineering",
  "departmentAbbr": "CSE",
  "hod": "Dr. Krishnamurthy G N",
  "abstract": "This project proposes a face recognition based attendance system...",
  "introduction": "Chapter 1 content...",
  "literatureSurvey": "Chapter 2 content...",
  "systemRequirements": "Chapter 3 content...",
  "methodology": "Chapter 4 content...",
  "results": "Chapter 5 content...",
  "conclusion": "Chapter 6 content...",
  "citations": ""
}
```

---

## How It Works

1. User fills multi-step form → clicks **Generate Report**
2. Frontend POSTs JSON to `POST /api/reports`
3. Backend saves to MongoDB
4. `typstGenerator.js`:
   - Creates a temp folder in `backend/outputs/<reportId>/`
   - Copies the entire template into it
   - Writes `citations.yaml` from form data
   - Writes all 6 chapter `.typ` files with real content
   - Writes `main.typ` with all variables injected (title, authors array, guide, department, etc.)
   - Runs `typst compile main.typ report.pdf`
5. PDF path stored in MongoDB, URL returned to frontend
6. Frontend shows **Download PDF** button

---

## Troubleshooting

**`typst: command not found`**
- Download the binary from https://github.com/typst/typst/releases
- Add it to your PATH: `export PATH=$PATH:/path/to/typst`

**MongoDB connection refused**
- Make sure `mongod` is running: `sudo systemctl start mongod`

**PDF fails with font errors**
- Install missing fonts (see Prerequisites table above)
- Or modify `template.typ` to use available fonts

**PDF fails with "decasify" package error**
- This is a Typst package — Typst should auto-download it on first compile
- Make sure you have internet access on first run
