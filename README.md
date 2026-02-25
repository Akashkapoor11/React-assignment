# Portal

> ReactJS Employee Management Portal — built as part of the Jotish frontend assignment.

![Employee Directory](screenshots/list.png)


---

## Screens

| Screen | Description |
|---|---|
| **Login** | Auth with `testuser` / `Test123` |
| **Employee List** | Searchable, sortable table with stats |
| **Details** | Full employee info + live camera capture |
| **Photo Result** | View, download or retake the captured photo |
| **Bar Graph** | Salary chart for top 10 employees |
| **Map** | City-wise geographic distribution |

---

## Tech Stack

- **React 18** + Vite
- **React Router v6** — client-side routing
- **Recharts** — bar graph / analytics
- **React Leaflet** — interactive map
- **Vanilla CSS** — dark glassmorphism design

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Login credentials**
```
Username: testuser
Password: Test123
```

---

## API

The app fetches employee data from the Jotish REST API:

```
POST https://backend.jotish.in/backend_dev/gettabledata.php
Content-Type: application/json

{ "username": "test", "password": "123456" }
```

> If the API server is unreachable, the app falls back to demo data automatically.

---

## Project Structure

```
src/
├── context/       # AuthContext — login + employee state
├── pages/         # LoginPage, ListPage, DetailsPage, PhotoResultPage, BarGraphPage, MapPage
├── components/    # Navbar
├── App.jsx        # Routes
└── index.css      # Global styles
```

--
