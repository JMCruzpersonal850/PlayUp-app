# PlayUp

**Local sports game hosting** — find pickup games near you, join open spots, and host your own sessions.

PlayUp is a full-stack web app for organizing community sports. Players can browse upcoming games, RSVP instantly, manage a personal dashboard, and publish new games with sport, location, time, and roster limits.

## Features

- **Browse games** with filters for sport, location, and keyword search
- **Host games** at Pensacola public parks with an interactive map picker
- **Pensacola park map** showing all 94 city parks with clickable pins
- **Google Business listings** for each park (ratings, hours, photos, maps link)
- **Join or leave games** with live roster counts and full-game detection
- **User accounts** with registration, login, and profile management
- **Dashboard** showing games you host and games you have joined
- **Demo seed data** for quick local exploration

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Prisma 7](https://www.prisma.io/) + SQLite
- JWT session cookies via [jose](https://github.com/panva/jose)
- Google Maps + Places API via [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

After seeding, you can sign in with:

| Email | Password |
| --- | --- |
| `alex@playup.dev` | `password123` |
| `jordan@playup.dev` | `password123` |
| `sam@playup.dev` | `password123` |

## Environment variables

Create a `.env` file (one is created automatically by Prisma):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-javascript-api-key"
GOOGLE_MAPS_API_KEY="your-google-places-api-key"
```

### Google Maps setup

To enable the interactive Pensacola parks map and live Google Business listings:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API (New)**
3. Create an API key and restrict it to your domain in production
4. Add the key to `.env` as shown above

Without API keys, the host flow still works using the searchable park list fallback and Google Maps search links.

## Project structure

```text
src/
  app/           # Pages and API routes
  components/    # UI and form components
  lib/           # Auth, database, game helpers, validation
prisma/
  schema.prisma  # User, Game, GameParticipant models
  seed.ts        # Demo data
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Run the production build |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:seed` | Load demo users and games |

## API overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Create an account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/logout` | POST | Sign out |
| `/api/auth/me` | GET | Current user |
| `/api/games` | GET | List games (with filters) |
| `/api/games` | POST | Create a game |
| `/api/games/[id]` | GET | Game details |
| `/api/games/[id]/join` | POST | Join a game |
| `/api/games/[id]/join` | DELETE | Leave a game |
| `/api/users/me` | PATCH | Update profile |
| `/api/parks` | GET | List Pensacola public parks |
| `/api/parks/[parkId]/listing` | GET | Google Business listing for a park |

## License

MIT
