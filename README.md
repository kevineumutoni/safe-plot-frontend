<div align="center">

# 🌍 SafePlot — Know Your Land Before You Build

### *Reba Umutekano w'Ubutaka Mbere yo Kubaka*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-safeplot.vercel.app-22c55e?style=for-the-badge&logo=vercel)](https://safeplot.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-render.com-0F4C35?style=for-the-badge&logo=render)]([https://safeplot-api.onrender.com](https://safe-plot-975524235617.us-central1.run.app/)
[![Built with Chakra UI](https://img.shields.io/badge/Chakra%20UI-v3-319795?style=for-the-badge&logo=chakraui)](https://chakra-ui.com)
[![Powered by Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Lyftathon 2026](https://img.shields.io/badge/Lyftathon-2026%20Kigali-f97316?style=for-the-badge)](https://lyftathon.com)

**Team Umoja Grid — City & Community Track — Lyftathon Kigali 2026**


</div>

---

## 🏆 The Problem — A Crisis Hidden in Plain Sight

Every rainy season in Kigali, hundreds of families lose their homes, savings, and livelihoods to floods and forced government relocations — **not from bad luck, but from lack of information.**

Kigali is one of Africa's fastest-growing cities. Rapid urbanisation has pushed thousands of residents into unplanned settlements built on ecologically sensitive land: protected river buffer zones along the Nyabugogo and Nyabarongo rivers, steep hillsides prone to erosion, and seasonal flood plains classified as High Risk under the Kigali Master Plan 2050.

**The data to prevent this already exists** — inside government GIS systems at RLMUA, REMA, and the City of Kigali. But those tools require desktop computers, GIS training, and English or French fluency. They are completely inaccessible to the ordinary Kigali resident who is about to invest their life savings in a plot of land.

> *A mother in Kimisagara saves for 5 years to buy land near a valley. She has no way to know it sits inside a protected ecological buffer zone. She builds. The rainy season comes. She loses everything.*

**SafePlot exists to close this gap.**

---

## 💡 The Solution

SafePlot is a **free, citizen-first Progressive Web Application** that lets any resident of Kigali instantly verify the safety of a land plot — in Kinyarwanda, on any smartphone, in under 6 seconds.

Tap a location on the map → Get an instant colour-coded risk verdict → Read a plain-language AI explanation → Find safer alternatives nearby.

No GIS training. No desktop. No English required.

---

## 🎯 Impact — Who This Protects

| Who | How SafePlot Helps |
|---|---|
| 🏠 **Land buyers** | Verify a plot before paying a deposit — avoiding life-savings loss |
| 👩 **Women-led households** | Primary land decision-makers in Rwanda now have a trusted tool in Kinyarwanda |
| 🏗️ **First-time builders** | Check slope, flood zone, and Master Plan restrictions before breaking ground |
| 🏛️ **City planners** | Brief communities on risk zones in the field without a laptop |
| 📱 **Low-connectivity users** | PWA works offline after first load; cached results always available |

**Kigali-specific impact zones covered:**
- Nyabugogo & Nyabarongo river buffer systems
- Gikondo industrial marshland
- Nyamirambo hillside erosion zones
- Kanzenze wetland edge
- Remera valley flood corridors
- 3 Districts · 34 Sectors · All cells and villages in Kigali City

---

## 🗺️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1 — CLIENT                                                │
│  React 18 + TypeScript + Chakra UI v3 + React-Leaflet          │
│  PWA (Workbox service worker) · i18next (Kinyarwanda/English)  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ POST /api/v1/risk/check
                       │ GET  /api/v1/weather/alert
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  TIER 2 — BACKEND (FastAPI · Python · Render.com)              │
│                                                                 │
│  ┌─────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Geo Risk    │  │ Gemini AI        │  │ Weather / Flood  │  │
│  │ Engine      │  │ Explanation      │  │ Alert Service    │  │
│  │ GeoPandas   │  │ 2.0 Flash · 20   │  │ Open-Meteo API   │  │
│  │ + Shapely   │  │ key rotation     │  │ 48h forecast     │  │
│  └──────┬──────┘  └────────┬─────────┘  └────────┬─────────┘  │
└─────────┼───────────────────┼────────────────────┼─────────────┘
          │                   │                    │
          ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  TIER 3 — DATA & AI                                            │
│  GeoJSON datasets · Rwanda Admin Boundaries · SRTM DEM        │
│  Ecological Buffer Zones · Flood Risk Zones · Master Plan 2050 │
│  Google Gemini 2.0 Flash · Open-Meteo (free, no key)          │
└─────────────────────────────────────────────────────────────────┘
```

[> 📐 **[View Full Architecture Diagram →]
![Uploading MacBook Pro 16_ - 3.png…]()](https://bcc-sand-pi.vercel.app/)


---

## 🤖 How the AI Works

SafePlot uses **Google Gemini 2.0 Flash** as its natural language engine, with a custom geospatial reasoning layer built on top.

### Step 1 — Spatial Risk Scoring (No AI required)

When a user taps a location, the FastAPI backend performs 5 parallel spatial queries using **GeoPandas** against official GeoJSON datasets:

| Factor | Weight | Data Source |
|---|---|---|
| Ecological Buffer Proximity | 30% | REMA / geodata.rw |
| Flood Zone Classification | 25% | City of Kigali / MIDMAR |
| Master Plan 2050 Zone Type | 20% | RLMUA zoning layer |
| Slope Risk (terrain steepness) | 15% | NASA SRTM DEM 30m |
| Valley Elevation Distance | 10% | SRTM derived |

A weighted score (0–100) is computed and mapped to a risk tier:

```
0–33   → 🟢 GREEN  — Safe (standard permits apply)
34–66  → 🟠 ORANGE — Caution (EIA + special permits required)
67–100 → 🔴 RED    — High Risk (construction prohibited / relocation risk)
```

### Step 2 — Gemini AI Explanation

The risk score JSON is passed to **Gemini 2.0 Flash** with a structured prompt:

```python
prompt = f"""
You are a land safety expert in Kigali, Rwanda.
Given this risk assessment: {risk_json}
Generate a plain-language explanation in BOTH Kinyarwanda and English.
Use simple language (Grade 6 level). Reference specific Kigali policies.
Mention the Kigali Master Plan 2050 and RLMUA permit requirements.
Return JSON: {{ "explanation_rw": "...", "explanation_en": "..." }}
"""
```

Gemini returns bilingual explanations that are human-readable, policy-specific, and safe for low-literacy users.

### Step 3 — Flood Alert Layer

Simultaneously, the backend calls **Open-Meteo API** for live 48-hour rainfall forecasts and combines them with the flood zone classification to produce a 4-level alert:

```
NONE → WATCH → WARNING → EMERGENCY
```

### Resilience Design

- **10 demo locations** use expert-curated hardcoded results — app works perfectly even if all APIs are offline
- **Up to 20 Gemini API keys** rotate automatically when free-tier quotas are exhausted
- **Fallback explanations** in both languages are served when Gemini is unavailable
- **No blank screens** — every code path has a graceful fallback

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core UI framework |
| **Chakra UI v3** | Component library (hackathon requirement) |
| React-Leaflet + Leaflet.js | Interactive Kigali map |
| Stadia Maps / OpenStreetMap | Satellite & normal map tiles |
| Zustand | Global state management |
| React Query (@tanstack) | API caching & async state |
| i18next | Kinyarwanda / English translations |
| Vite | Build tool |
| Workbox | PWA service worker & offline caching |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API — 4 routers |
| GeoPandas + Shapely | Geospatial risk engine |
| Google Gemini 2.0 Flash | AI explanations (bilingual) |
| Open-Meteo API | Live flood & rainfall data |
| Uvicorn | ASGI server |
| Docker | Containerised deployment |

### Infrastructure (all free tier)
| Service | What it hosts |
|---|---|
| Vercel | Frontend PWA |
| Render.com | FastAPI backend |
| Open-Meteo | Weather data (no API key needed) |
| Google AI Studio | Gemini API (free tier, 20-key rotation) |
| GitHub Actions | CI/CD — lint, test, deploy on push |

---

## 🚀 Running the Project Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/umoja-grid/safeplot.git
cd safeplot
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Copy the environment file and add your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Add at least one Gemini key — get a free key at https://aistudio.google.com
GEMINI_API_KEY_1=your_gemini_key_here
GEMINI_API_KEY_2=optional_second_key
# Add up to 20 keys for quota rotation — app works with just 1

ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

Backend will be live at: `http://localhost:8000`
Health check: `http://localhost:8000/api/v1/health`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend will be live at: `http://localhost:5173`

### 4. Using the Live Backend (no local setup needed)

If you just want to run the frontend against our deployed backend, set:

```env
VITE_API_BASE_URL=https://safeplot-api.onrender.com
```

Then just run `npm run dev` in the frontend directory — no Python setup required.

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| **Frontend (PWA)** | https://bcc-sand-pi.vercel.app/ |
| **Backend API** | https://safe-plot-975524235617.us-central1.run.app/ |
| **API Health Check** | https://safeplot-api.onrender.com/api/v1/health |
| **API Docs (Swagger)** | https://bcc-sand-pi.vercel.app/docs |

> ⚠️ **Note:** The backend is hosted on Render.com free tier and may take 30–60 seconds to wake up on the first request after inactivity. The 10 demo locations are served from memory and will always respond instantly.

---

## 📍 Demo Locations — Try These First

Click any of these on the map for an instant, expert-curated risk assessment:

| Location | Risk | Why |
|---|---|---|
| 🔴 Nyabugogo Valley | HIGH RISK | Inside protected river buffer zone |
| 🔴 Gikondo Industrial Marsh | HIGH RISK | Active wetland, seasonal flooding |
| 🔴 Nyamirambo Steep Slope | HIGH RISK | >30° slope, erosion and landslide risk |
| 🔴 Kanzenze Wetland Edge | HIGH RISK | Wetland boundary, restricted construction |
| 🟠 Rugunga Wetland Buffer | CAUTION | 50m from buffer zone, EIA required |
| 🟠 Remera Valley Section | CAUTION | Moderate flood zone (25-yr return) |
| 🟢 Gisozi Residential Zone | SAFE | Approved residential, flat terrain |
| 🟢 Kimironko Hill Zone | SAFE | Approved zone, good elevation |
| 🟢 Kanombe Plateau Zone | SAFE | Master Plan 2050 residential zone |
| 🟢 Bumbogo Northern Zone | SAFE | Low risk, approved for construction |

---

## 📁 Project Structure

```
safeplot/
├── frontend/                   # React + Chakra UI v3 PWA
│   ├── src/
│   │   ├── components/
│   │   │   ├── map/
│   │   │   │   ├── KigaliMap.tsx       # Main interactive map
│   │   │   │   ├── DemoMarkers.tsx     # 10 demo location pins
│   │   │   │   ├── RiskZoneOverlay.tsx # Coloured zone polygons
│   │   │   │   ├── SearchBar.tsx       # Place search with autocomplete
│   │   │   │   └── MapPage.tsx         # Main map page layout
│   │   │   ├── ui/
│   │   │   │   ├── NavBar.tsx
│   │   │   │   ├── RiskBadge.tsx
│   │   │   │   ├── FloodAlertBanner.tsx
│   │   │   │   └── Loader.tsx
│   │   │   └── chat/
│   │   │       ├── AIChat.tsx          # In-panel AI chat
│   │   │       └── MapChatWidget.tsx   # Floating map chat bubble
│   │   ├── pages/
│   │   │   ├── SearchPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   └── HistoryPage.tsx
│   │   ├── store/
│   │   │   └── useAppStore.ts          # Zustand global state
│   │   ├── api/
│   │   │   └── client.ts               # Axios API client
│   │   ├── types/                      # TypeScript interfaces
│   │   ├── i18n/                       # Kinyarwanda + English translations
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── public/
│   │   └── manifest.json               # PWA manifest
│   └── .env.example
│
├── backend/                    # FastAPI Python backend
│   ├── routers/
│   │   ├── risk.py             # POST /api/v1/risk/check + /chat
│   │   ├── admin.py            # GET /api/v1/admin/* (district/sector/cell/village)
│   │   └── weather.py          # GET /api/v1/weather/alert
│   ├── services/
│   │   ├── geo_service.py      # GeoPandas spatial risk engine
│   │   ├── gemini_service.py   # Gemini AI + key rotation
│   │   ├── weather_service.py  # Open-Meteo integration
│   │   └── demo_service.py     # Hardcoded expert demo results
│   ├── data/
│   │   ├── ecological_buffer_zones.geojson
│   │   ├── flood_risk_zones.geojson
│   │   ├── master_plan_2050.geojson
│   │   └── kigali_admin_boundaries.geojson
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
└── docs/
    ├── SafePlot_PRD_v1.0.docx
    ├── SafePlot_Architecture.html
    └── architecture.png
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/risk/check` | Main risk assessment for coordinates |
| `POST` | `/api/v1/risk/chat` | Gemini AI chat with risk context |
| `GET` | `/api/v1/admin/districts` | All Kigali districts |
| `GET` | `/api/v1/admin/sectors/{district}` | Sectors for a district |
| `GET` | `/api/v1/admin/cells/{district}/{sector}` | Cells for a sector |
| `GET` | `/api/v1/admin/villages/{d}/{s}/{c}` | Villages for a cell |
| `GET` | `/api/v1/weather/alert?lat&lng&flood_zone` | Live flood alert + 48h rainfall |
| `GET` | `/api/v1/health` | Backend health + layer status |

**Example request:**

```bash
curl -X POST https://safeplot-api.onrender.com/api/v1/risk/check \
  -H "Content-Type: application/json" \
  -d '{"latitude": -1.9558, "longitude": 30.0472, "session_token": "demo"}'
```

**Example response:**

```json
{
  "risk_score": 78,
  "risk_color": "RED",
  "risk_label_en": "High Risk",
  "risk_label_rw": "Ingereko Nini",
  "explanation_en": "This location falls inside the Nyabugogo protected ecological buffer zone...",
  "explanation_rw": "Aho hantu hari mu nzitizi y'ibidukikije ya Nyabugogo...",
  "factors": [
    { "name": "Ecological Buffer Proximity", "score": 30, "weight": 0.30, "detail": "Inside buffer zone" },
    { "name": "Flood Zone", "score": 25, "weight": 0.25, "detail": "High flood zone (10-yr return)" }
  ],
  "flood_alert": { "alert_level": "WARNING", "rainfall_24h_mm": 42.3 },
  "safe_suggestions": [
    { "name": "Gisozi Residential Zone", "distance_km": 2.4, "description_en": "..." }
  ]
}
```

---

## 👥 Team Umoja Grid

Built in 12 hours at **Lyftathon Kigali 2026** — a CareerLyft Technologies Ltd hackathon.

**Track:** City & Community
**Event:** Lyftathon Kigali 2026 · May 2, 2026 · 9:00 AM – 9:00 PM
**Venue:** Kigali City

---

## 📄 Data Sources

| Dataset | Source | License |
|---|---|---|
| Ecological Buffer Zone Boundaries | REMA / geodata.rw | Public Interest |
| Kigali Flood Risk Zones | City of Kigali / MIDMAR | Public Interest |
| Master Plan 2050 Zoning | City of Kigali / RLMUA | Public Interest |
| Rwanda Admin Boundaries | NISR / HDX | Open Data |
| SRTM DEM 30m | NASA / USGS EarthExplorer | Public Domain |
| Live Rainfall Forecast | Open-Meteo | Free / Open |
| AI Language Model | Google Gemini 2.0 Flash | Google AI Terms |

---

## ⚠️ Disclaimer

SafePlot is built as a citizen awareness tool to democratise access to publicly available land risk data. It is not a substitute for official land tenure verification from RLMUA or a formal Environmental Impact Assessment. Always verify land purchase decisions with official government authorities.

---

<div align="center">

**SafePlot — Know Your Land Before You Build**
*Reba Umutekano w'Ubutaka Mbere yo Kubaka*

Built with ❤️ in Kigali by **Team Umoja Grid** · Lyftathon 2026

</div>
