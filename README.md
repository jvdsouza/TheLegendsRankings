# The Legends Rankings

Rankings for The Legends local hosted by CryingLegend.

## Specifications

- Players are divided into tiers of at most 6.
- Tier 1 is the top (best) tier; higher tier numbers are lower.
- Tiers are filled bottom-up: every tier has exactly 6 players, except Tier 1,
  which absorbs whatever is left over (1-6 players) if the total isn't
  divisible by 6.
- After the final local of the season, the top two players of a tier can
  compete with the bottom two of the tier above. (Not yet implemented.)

## Stack

- **Next.js** (App Router, TypeScript, Tailwind CSS) - public leaderboard + admin CRM
- **Supabase** - Postgres database for the roster, plus Auth for admin login
- Deploys for free on **Vercel** (frontend) + **Supabase** (database/auth)

## Project structure

- `src/app/page.tsx` - public leaderboard, splits the ranked roster into tiers
- `src/app/login` - admin sign-in page
- `src/app/admin` - protected CRM: add, edit, remove, and reorder players
- `src/lib/tiers.ts` - tier-splitting logic (6 per tier, remainder in Tier 1)
- `src/lib/supabase` - Supabase client helpers (browser, server, middleware)
- `src/proxy.ts` - redirects signed-out users away from `/admin`
- `supabase/schemas/players.sql` - declarative table definition (source of truth)
- `supabase/migrations/` - versioned SQL applied via `supabase db push`
- `supabase/config.toml` - Supabase CLI config

## Local setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account/project.
2. In **Authentication > Providers**, disable "Allow new users to sign up"
   (this app has no public sign-up page; admins are created manually).
3. In **Authentication > Users**, click "Add user" to create an account for
   yourself (and anyone else who manages the roster). Use email + password.
4. In **Project Settings > API Keys**, copy the **Project URL** and the
   **publishable** key (`sb_publishable_...`). The older `anon` key still
   works but is deprecated - new projects should use the publishable key.
5. Apply the database schema using the Supabase CLI:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   This applies all migrations in `supabase/migrations/` — no manual SQL needed.

### Making schema changes

Edit `supabase/schemas/players.sql` to reflect the new desired state, then add a
new migration file in `supabase/migrations/` with the corresponding `ALTER TABLE`
statement, and run `npx supabase db push`.

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from step 1:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Run the app

```bash
npm install
npm run dev
```

- Public leaderboard: [http://localhost:3000](http://localhost:3000)
- Admin sign-in: [http://localhost:3000/login](http://localhost:3000/login)

## Deployment (free)

1. Push this repo to GitHub.
2. Create a new project on [Vercel](https://vercel.com), importing the repo.
3. Add the two environment variables from `.env.local` in the Vercel project
   settings (Settings > Environment Variables).
4. Deploy. The Supabase free tier and Vercel's hobby tier cover this project's
   scale at no cost.

## How tiers are computed

Players are stored as a single ranked list (`rank_position`, 1 = best). The
leaderboard splits that list into tiers of 6, working from the bottom of the
list upward. If the total number of players isn't divisible by 6, Tier 1 (the
top tier) ends up with the leftover (1-5) players instead of 6. See
[`src/lib/tiers.ts`](src/lib/tiers.ts).
