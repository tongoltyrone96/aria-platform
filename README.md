# ARIA Platform

ARIA Web Platform — marketing site, user dashboard, REST API, license system, payments.

## Stack

- **Web**: Next.js 15 (App Router) — deployed to Vercel
- **API**: Fastify 5 (Node.js 20) — deployed to DigitalOcean
- **DB**: Drizzle ORM + Supabase Postgres
- **Payments**: Paddle (Merchant of Record)
- **Email**: Resend + React Email

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env file
cp .env.example .env.local

# Fill in env vars, then:
pnpm db:generate
pnpm db:migrate

# Start dev servers
pnpm dev
```

## Structure

```
aria-platform/
├── apps/
│   ├── web/    # Next.js 15 marketing + dashboard
│   └── api/    # Fastify REST API
├── packages/
│   ├── db/     # Drizzle schema + migrations
│   ├── shared/ # Shared types / enums
│   └── ui/     # shadcn component library
└── infra/      # Docker, Caddy, GitHub Actions
```
