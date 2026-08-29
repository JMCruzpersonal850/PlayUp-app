# PlayUp Production Deployment Guide

This guide covers everything you need to run PlayUp **for real** — not just locally.

## Production readiness checklist

| Requirement | Status | What you need |
| --- | --- | --- |
| App builds | Done | `npm run build` passes |
| Hosted database | **You set up** | Turso (recommended) or persistent SQLite on Railway |
| JWT secret | **You set up** | Long random string in production |
| Google Maps API key | **You set up** | For interactive park map |
| Google Places API key | **You set up** | For park business listings |
| Google Map ID | **You set up** | Required for map pins |
| Domain + hosting | **You set up** | Vercel, Railway, or similar |
| Billing on Google Cloud | **You set up** | Maps/Places APIs require billing enabled |

---

## 1. Google Cloud (maps + business listings)

This is required for the Pensacola parks map and Google Business listings when hosting games.

### Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (e.g. `playup-pensacola`)
3. Enable billing on the project
4. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API (New)**
5. Create credentials:
   - **API key** for browser (restrict to your domain in production)
   - Optionally a separate server key for Places lookups
6. Create a **Map ID**:
   - Go to **Google Maps Platform → Map Management**
   - Create a map with type **JavaScript** and vector tiles
   - Copy the Map ID

### Add to `.env`

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza..."
GOOGLE_MAPS_API_KEY="AIza..."
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="your-map-id"
```

> `NEXT_PUBLIC_*` vars are exposed to the browser (required for the map). `GOOGLE_MAPS_API_KEY` stays server-side for Places API calls.

---

## 2. Database (production)

**SQLite files do not work on Vercel** — the filesystem is ephemeral. Use one of these:

### Option A: Turso (recommended for Vercel)

Turso is SQLite-compatible and works with the existing Prisma schema.

```bash
# Install Turso CLI: https://docs.turso.tech/cli
turso db create playup-prod
turso db show playup-prod --url
turso db tokens create playup-prod
```

Set environment variables:

```env
DATABASE_URL="libsql://playup-prod-yourorg.turso.io"
TURSO_AUTH_TOKEN="your-token"
```

Push schema to Turso:

```bash
npx prisma migrate deploy
```

### Option B: Railway with persistent volume

Railway can mount a volume so SQLite persists:

```env
DATABASE_URL="file:/data/playup.db"
```

Attach a volume at `/data` in Railway settings.

### Option C: Local development (current default)

```env
DATABASE_URL="file:./dev.db"
```

---

## 3. Auth secret

Generate a strong secret:

```bash
openssl rand -base64 48
```

```env
JWT_SECRET="paste-generated-secret-here"
```

Never use the default dev secret in production.

---

## 4. Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy — `vercel.json` runs migrations automatically

### Required Vercel env vars

```
DATABASE_URL
TURSO_AUTH_TOKEN          # if using Turso
JWT_SECRET
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
```

### Verify deployment

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "turso",
  "maps": { "clientKey": true, "placesKey": true, "mapId": true },
  "auth": { "jwtConfigured": true }
}
```

---

## 5. Deploy to Railway (alternative)

1. Create a new project at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Add environment variables
4. For SQLite: attach a volume at `/data` and set `DATABASE_URL=file:/data/playup.db`
5. Set start command: `npm run start`

---

## 6. What's still missing for a "real" product

These are not built yet but you'd want them eventually:

| Feature | Why it matters |
| --- | --- |
| Email verification | Confirm users own their email |
| Password reset | Users forget passwords |
| OAuth (Google/Apple login) | Easier sign-up |
| Push/email notifications | Remind players before games |
| Mobile app (PWA) | Better on phones |
| Moderation/reporting | Safety for public games |
| Payments | Paid leagues or court fees |
| Multi-city support | Expand beyond Pensacola |
| Admin dashboard | Manage users and games |

---

## Quick local → production path

```bash
# 1. Local dev (works today)
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev

# 2. Add Google keys to .env (see section 1)

# 3. Production build test
npm run build
npm run start

# 4. Set up Turso + Vercel (sections 2 and 4)
```

---

## Cost estimate (monthly)

| Service | Free tier | Notes |
| --- | --- | --- |
| Vercel | Hobby free | Enough for early users |
| Turso | 9 GB free | Plenty for this app |
| Google Maps | $200/mo credit | Usually covers small apps |
| Domain | ~$12/year | Optional custom domain |

---

## Support

- Health check: `GET /api/health`
- Demo logins after seeding: `alex@playup.dev` / `password123`
