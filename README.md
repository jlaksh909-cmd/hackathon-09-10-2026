# CampusHub - Academic Resource Moderation Portal

A modern, responsive, and robust academic resource moderation dashboard built for CampusHub. Designed for college faculty, senior students, and academic admins to review, verify syllabus compliance, flag for academic review, and manage crowdsourced academic study material across engineering departments.

---

## Features

- **Real-Time Verification Queue**: Review pending student submissions with syllabus compliance checks, author details, and resource scopes.
- **Interactive Inspection Modal**: Inspect complete submission metadata, source links, summaries, and take immediate approve/reject decisions.
- **Managed Academic Library**: Filter verified, live study materials across engineering branches (CSE, ECE, MECH, CIVIL) and academic years (1st to 4th Year).
- **Flagging & Escalation System**: Flag resources requiring peer review or syllabus revision.
- **Live Metrics & Stats**: Instant tracking of Total Resources, Pending Submissions, Active Library Items, and Community Credibility Upvotes.
- **Toast Notification System**: Instant interactive feedback for moderation actions.

---

## Tech Stack

- **React 18** (Functional Components, Hooks, Modular Architecture)
- **TypeScript** (Strict type safety, ambient declarations)
- **Tailwind CSS** (Dark mode glassmorphism UI with curated palette)

---

## Getting Started

### Quick Start
Open `index.html` in your browser or serve with any static web server:

```bash
# Using Python
python -m http.server 3000

# Using Node
npx serve
```

Navigate to `http://localhost:3000`.

---

## Directory Structure

```text
├── index.html                  # Dashboard entry point
├── dist/
│   └── bundle.js               # Compiled application bundle
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── AdminDashboard.tsx   # Core moderation interface
│   │       └── react-env.d.ts       # Type environment declarations
│   └── data/
│       └── mockData.ts              # Department resources mock dataset
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```
