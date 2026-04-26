# ConstructIQ — Construction Analytics Dashboard

> Built as a direct response to a real business conversation:
> *"AI plus analysis skills would set you apart. General Construction companies use Procore — maximizing this database would be of great value. I could see you taking the company needs to make us more efficient through IT systems."*

This project is a working proof of concept — not a tutorial, not a template. It demonstrates what it looks like when someone with IT, data analysis, and AI skills looks at a construction company's operational pain points and builds a solution in response.

---

## The Business Problem

Companies that use **Procore** accumulate a rich dataset: project timelines, budgets, change orders, subcontractor performance, safety records, and task completion rates. Most of that data sits in Procore dashboards that show *what happened* — not *what's about to go wrong*.

Project managers are often reacting to problems rather than preventing them. A project that's 3 days late and 5% over budget today becomes a 3-week delay and a $400K overrun by close — if nobody flags the trend early.

This dashboard addresses that gap.

---

## What This Demonstrates

### 1. AI-Augmented Analysis (Rule Engine)
A lightweight rule-based engine (`src/lib/analytics.ts`) mirrors the kind of logic a VP of IT would want embedded in any Procore integration or replacement system:

- Projects are automatically classified: **On Time → At Risk → High Risk → Critical**
- A **risk score (0–100)** is computed from three weighted signals:
  - Schedule delay (max 50 pts)
  - Budget overrun (max 30 pts)
  - Delayed task count (max 20 pts)
- Alerts are auto-generated and severity-ranked
- Insights are synthesized across the portfolio (e.g., "Change orders are the primary cost driver for 2 critical projects")

This is the pattern for how AI adds value in construction ops — not replacing Procore, but sitting on top of it to surface what the raw data obscures.

### 2. Data Ingestion & Flexibility
The **Data Upload** page accepts CSV exports (the format Procore and most ERP systems support). Drop in a file, and the entire dashboard — KPIs, charts, alerts, insights — rebuilds from the new data. This is how a real integration starts: pull from the source system, normalize, analyze.

### 3. Portfolio-Level Visibility
Eight mock projects spanning Commercial, Residential, Infrastructure, Industrial, and Public sectors show what a multi-project portfolio view looks like — the kind of view a VP of IT or COO needs, not individual PMs.

| Metric | What It Shows |
|---|---|
| On-Time Delivery % | Schedule health at a glance |
| Portfolio Budget vs Actual | Total cost exposure |
| Average Risk Score | Where to focus attention first |
| Active Alerts | What needs action today |

---

## The Broader Vision

The same pattern applied here to **Procore / Construction** extends directly to the other pain points mentioned:

| Department | Current Tool | Analytics Opportunity |
|---|---|---|
| Construction | Procore | Schedule risk, cost forecasting, subcontractor performance |
| Human Resources | ATS / HRIS | Turnover prediction, hiring funnel analysis, headcount planning |
| Logistics | ERP / TMS | Delivery delay patterns, vendor risk scoring, route optimization signals |

The underlying approach is the same: connect to the system of record, extract the signal from the noise, surface it in a form that drives decisions rather than just reports history.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Build | Vite + Bun |
| AI Engine | Rule-based (extensible to LLM) |

No backend required. Designed to be deployed as a static app and connected to any REST API or CSV export from Procore, SAP, Workday, or a custom system.

---

## Running Locally

```bash
# Install bun if needed
curl -fsSL https://bun.sh/install | bash

git clone https://github.com/incastil/construction-dashboard.git
cd construction-dashboard
bun install
bun run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
src/
├── lib/
│   ├── analytics.ts      # Rule engine: risk scoring, alerts, insights
│   └── formatters.ts     # Currency, percent, date helpers
├── data/
│   └── mockProjects.ts   # 8 realistic Procore-style projects
├── hooks/
│   ├── useProjects.ts    # Central data, filter, sort state
│   └── useTheme.ts       # Dark mode (persisted)
├── components/           # Cards, charts, table, alerts, insights
└── pages/                # Dashboard, Projects, Analytics, Upload, Settings
```

---

## What's Next (If This Were Production)

1. **Procore API integration** — OAuth + REST to pull live project, budget, and RFI data
2. **LLM layer** — Replace the rule engine with a model that can reason over unstructured notes, RFIs, and change order descriptions
3. **HR module** — Same architecture applied to headcount and turnover data
4. **Logistics module** — Delivery performance and vendor risk scoring
5. **Role-based views** — PM sees their projects; COO sees the portfolio; VP IT sees system health

---

*Built by Ivan Castillo — demonstrating that the gap between "we have data in Procore" and "we make better decisions because of it" is a solvable engineering and analysis problem.*
