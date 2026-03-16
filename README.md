# Swept

> *Your property, always guest-ready.*

A two-sided marketplace connecting property owners and Airbnb hosts with local cleaners and cleaning companies.

---

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** Supabase Auth
- **Payments:** Stripe (Phase 4)

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A Supabase project (create one at [supabase.com](https://supabase.com))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd swept
npm install         # installs root devDependencies
cd client && npm install
cd ../server && npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your actual values
```

Also create `server/.env` with the server-side variables (or symlink from root `.env`).

### 3. Set up the database

```bash
createdb swept_dev
psql swept_dev < database/migrations/001_create_users.sql
psql swept_dev < database/migrations/002_create_properties.sql
psql swept_dev < database/migrations/003_create_cleaner_profiles.sql
```

### 4. Run in development

```bash
# From root — starts both client and server
npm run dev

# Or individually:
npm run dev:client   # React at http://localhost:5173
npm run dev:server   # Express at http://localhost:3001
```

---

## Project Structure

```
swept/
├── client/          # React frontend (Vite)
├── server/          # Node.js + Express API
├── database/
│   └── migrations/  # SQL migration files
└── .env.example
```

---

## Development Phases

- **Phase 1** — Foundation (auth, profiles, DB schema) ✅
- **Phase 2** — Listings & Search
- **Phase 3** — Booking Flow
- **Phase 4** — Payments (Stripe)
- **Phase 5** — Reviews, Notifications & Polish
