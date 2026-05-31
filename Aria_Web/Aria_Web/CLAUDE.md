# Aria_Web Project — Component State Reference

**Product**: Aria — AI Interview Assist Desktop App (Windows)  
**Purpose**: Landing/marketing site + Auth + Dashboard for the Aria desktop app  
**Stack**: React + Vite + TypeScript + Tailwind CSS v4 + ShadCN UI + motion/react (Framer Motion)  
**Package manager**: pnpm  
**Dev server**: `pnpm dev` → http://127.0.0.1:5173  
**Download placeholder**: `/downloads/AriaSetup.exe` (place .exe in `public/downloads/`)

---

## Visual Design Constraints

- Do not use pale peach/cream/salmon-tinted UI backgrounds such as `#FFF8F5`, `#FFF2EC`, `#FFF0E8`, or similar warm washed backgrounds for new UI.
- Prefer clean white, `slate-50`, `slate-100`, and `slate-200` borders for light panels.
- Keep brand orange `#F05A28` as an accent/action color, not as a washed panel background.

---

## Product Implementation Standard

- Do not build UI behavior from arbitrary example arrays when a realistic product structure is possible.
- Before adding mock data, decide what real backend entity would drive the feature and shape the frontend around that entity.
- If backend integration is missing, use temporary data only behind a structure that can be directly replaced by API results.
- Date-based UI must be generated from real calendar logic:
  - months from the current year or the user's actual available usage range
  - daily views from the selected month and real day count
  - no future dates unless intentionally displayed as disabled or zero
  - timezone handling must be defined when backend integration is added
- For analytics, derive chart labels and graph values from usage records, not hand-written chart coordinates.
- If a requested feature cannot be fully real without backend support, state that clearly and document the backend contract needed for integration.
- When making future changes, first explain whether the change is production-usable, temporary frontend-only, or blocked on backend work.

---

## Routes — `src/app/App.tsx`

| Path | Component |
|------|-----------|
| `/` | `LandingPage` |
| `/signin` | `SignIn` |
| `/signup` | `SignUp` |
| `/checkout` | `Checkout` |
| `/checkout/success` | `CheckoutSuccess` |
| `/checkout/cancel` | `CheckoutCancel` |
| `/dashboard` | `DashboardLayout` → `Overview` |
| `/dashboard/usage` | `DashboardLayout` → `Usage` |
| `/dashboard/interviews` | `DashboardLayout` → `Interviews` |
| `/dashboard/billing` | `DashboardLayout` → `Billing` |
| `/dashboard/settings` | `DashboardLayout` → `Settings` |
| `/dashboard/support` | `DashboardLayout` → `Help Centre` (`Support.tsx`) |

---

## Auth State (temporary — pre-Supabase)

- Stored in `localStorage` key `"aria_authed"` (`"1"` when logged in)
- Selected plan may be stored in `localStorage` key `"aria_plan"` (`"free"`, `"pro"`, or `"elite"`)
- **Set**: `SignUp.handleSubmit` and `SignIn.handleSubmit` after mock delay
- **Cleared**: `DashboardLayout.handleSignOut` → also navigates to `/`
- **Read**: `Header` — shows **Dashboard** button when authed, **Sign In / Sign Up** when not
- TODO [SUPABASE:AUTH]: replace all `localStorage.setItem/removeItem("aria_authed")` with real Supabase session
- TODO [SUPABASE:DB]: persist selected plan, Stripe customer id, Stripe subscription id, and subscription status server-side
- Frontend route guard exists in `src/app/App.tsx` (`RequireAuth`) for `/dashboard`, `/checkout`, and `/checkout/success`.
- This guard is only a demo UX guard because users can edit localStorage. Real access control must happen server-side.

---

## Assets

| File | Location | Purpose |
|------|----------|---------|
| AriaLogo.png | `public/AriaLogo.png` | Animated logo mask (canvas gradient) |
| Log-in.png | `public/Log-in.png` | Auth split-page image used by both SignUp and SignIn |
| Log-up.png | `public/Log-up.png` | Old signup image, currently not used by auth pages |
| hero-bg.png | `public/hero-bg.png` | Hero section background image |
| App_Interview.png | `public/App_Interview.png` | Aria app interview screen screenshot |
| App_SK.png | `public/App_SK.png` | Aria app settings/signup screen |
| App_Settings.png | `public/App_Settings.png` | Aria app settings screen |
| interview1.png | `public/interview1.png` | Person at desktop with Aria + interviewer on screen |
| interview2.jpeg | `public/interview2.jpeg` | Split image: stressed (left) vs confident with Aria (right) |

---

## Landing Page Components

### Header — `src/app/components/Header.tsx`
Floating dark pill navbar (fixed, top-8).
- **Logo**: AnimatedLogo canvas gradient
- **Nav links**: Features · How It Works · Pricing · Testimonials · FAQ
- **CTA (unauthenticated)**: Sign In (text link) + Sign Up (white pill button)
- **CTA (authenticated)**: Dashboard (white pill button) — reads `localStorage.aria_authed`
- **Mobile**: hamburger → dark rounded-2xl dropdown (same auth-aware CTA)
- **Scroll effect**: shadow intensifies on scroll

---

### Hero — `src/app/components/Hero.tsx`
- Scroll animations via `motion/react` `whileInView` (once: true) on all elements
- Badge → H1 → subtext → CTA stagger with 0.1s delay increments
- Feature badges: stagger by column index
- Video frame: fade + scale(0.97 → 1)

---

### PlatformBanner — `src/app/components/PlatformBanner.tsx`
- Heading fadeUp, marquee strip fadeIn (delay 0.2s)
- 8 platforms: Zoom · Google Meet · Teams · Slack · Webex · Telegram · Discord · Skype
- Infinite marquee `marquee-rtl` 28s

---

### Features — `src/app/components/Features.tsx`
- Heading fadeUp, 9 cards stagger by column (delay = (index % 3) * 0.1s)

---

### Benefits — `src/app/components/Benefits.tsx`
- Left text/checklist: slides in from left (x: -40), checklist items stagger
- Right use-case cards: slide in from right (x: 40), stagger by index

---

### HowItWorks — `src/app/components/HowItWorks.tsx`
- 3 steps, alternating image-left / image-right layout
- Text and image slide in from opposite directions per step

---

### Testimonials — `src/app/components/Testimonials.tsx`
- Heading fadeUp, 6 cards stagger by column

---

### Pricing — `src/app/components/Pricing.tsx`
- **Plans**: Free ($0) · Pro ($19.99/mo) ⭐ · Elite ($29.99/mo)
- Heading fadeUp, 3 plan cards stagger (delay = index * 0.12s)
- Hover effect: hovered card scales up, others scale down + opacity 70%
- CTA links still go to `/signup?plan=<planId>`.
- Paid plans continue to Stripe Checkout after account creation.

---

### FAQ — `src/app/components/FAQ.tsx`
- 9 accordion items, stagger (delay = index * 0.05s)
- "Still have questions / Contact Support" section removed

---

### Footer — `src/app/components/Footer.tsx`
Dark bg. 4-column grid: Brand · Product · Support · Contact

---

## Auth Pages

### SignUp — `src/app/pages/auth/SignUp.tsx`

**Layout**: Split desktop auth page, fixed `h-screen overflow-hidden`.
- Left: signup form (`lg:w-1/2 xl:w-2/5`)
- Right: visual image panel (`lg:w-1/2 xl:w-3/5`)
- Mobile: form only

**VisualPanel**
- Shared by SignUp and SignIn.
- Uses `public/Log-in.png`.
- `<img className="h-full w-full object-cover object-top" />`.

**SignupPanel**
- Aria logo is positioned at the top-left of the left form panel on desktop.
- Progress bar + step indicators sit below the logo area.
- Form centered in remaining space
- `<form onSubmit>` — Enter key advances steps / submits
- **Step 1**: First name (`e.g. John`) · Last name (`e.g. Smith`) · Email (`your@email.com`) + Google OAuth button
- **Step 2**: Password (`Min. 8 characters`) · Confirm password (`Re-enter your password`) + strength/match indicators
- **Step 3**: Plan selection (Free / Pro / Elite) radio-style buttons
- On submit:
  - Sets `localStorage.setItem("aria_authed", "1")`
  - Sets `localStorage.setItem("aria_plan", formData.plan)`
  - Free → `navigate("/dashboard")`
  - Pro/Elite → `navigate("/checkout?plan=<planId>")`

---

### SignIn — `src/app/pages/auth/SignIn.tsx`
- Split desktop auth page, fixed `h-screen overflow-hidden`.
- Left: white sign-in form panel (`lg:w-1/2 xl:w-2/5`)
- Right: shared `VisualPanel` using `/Log-in.png`
- Desktop Aria logo at the top-left of the left panel.
- Google social button only; GitHub button removed.
- On submit: sets `localStorage.setItem("aria_authed", "1")` + `navigate("/dashboard")`

---

## Stripe Checkout Integration Notes

This frontend now assumes Stripe Checkout is the payment path for paid plans. Do not build a custom card-entry form in React unless the product decision changes. Card number, CVC, billing details, coupons, invoices, and PCI-sensitive payment handling should stay on Stripe-hosted Checkout or Stripe Customer Portal.

### Frontend Routes

| Path | Purpose |
|------|---------|
| `/checkout?plan=pro` | Review selected Pro plan and start Stripe Checkout |
| `/checkout?plan=elite` | Review selected Elite plan and start Stripe Checkout |
| `/checkout/success?plan=<planId>` | Return page after successful Stripe Checkout |
| `/checkout/cancel?plan=<planId>` | Return page when user cancels Stripe Checkout |

### Frontend Checkout Component

File: `src/app/pages/checkout/Checkout.tsx`

Current behavior:
- Accepts only paid plans: `pro`, `elite`.
- Shows selected plan summary.
- On "Continue to Stripe", calls:
- Route is wrapped in frontend `RequireAuth`, but backend must still validate the authenticated user.

```http
POST /api/stripe/create-checkout-session
Content-Type: application/json
```

Request body:

```json
{
  "planId": "pro",
  "successUrl": "http://127.0.0.1:5173/checkout/success?plan=pro",
  "cancelUrl": "http://127.0.0.1:5173/checkout/cancel?plan=pro"
}
```

Expected response:

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

The browser redirects to `data.url`.

### Temporary Local API

File: `server/stripe-api.mjs`

Purpose:
- Minimal Express API for local Stripe Checkout testing.
- Uses direct Stripe REST API through `fetch`; no `stripe` npm package is currently installed.
- Vite dev proxy forwards `/api` to `http://127.0.0.1:4242`.

Package scripts:

```bash
pnpm api
pnpm dev
```

Required environment variables:

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ELITE=price_...
CLIENT_ORIGIN=http://127.0.0.1:5173
PORT=4242
```

Vite proxy:

```ts
server: {
  host: "127.0.0.1",
  port: 5173,
  proxy: {
    "/api": "http://127.0.0.1:4242",
  },
}
```

### Required Backend Work

Replace or harden `server/stripe-api.mjs` according to the real backend stack. The backend must own all Stripe secret operations.

Implement:
- `POST /api/stripe/create-checkout-session`
- `GET /api/billing/subscription-status` or equivalent, used after Stripe returns to verify the user's real subscription state
- `POST /api/stripe/create-portal-session` for card updates, cancellation, upgrades/downgrades after subscription
- `POST /api/stripe/webhook`
- Auth/session validation on checkout creation
- DB persistence for Stripe customer/subscription records

Recommended request handling for `create-checkout-session`:
- Require authenticated user.
- Reject requests without a valid Supabase session/JWT even if the frontend route guard passed.
- Validate `planId` is one of `pro`, `elite`.
- Resolve Stripe Price ID server-side only.
- Create or reuse a Stripe Customer for the authenticated user.
- Add metadata:
  - `userId`
  - `planId`
  - optionally `email`
- Create Checkout Session with:
  - `mode: "subscription"`
  - one line item using the selected Stripe Price ID
  - `success_url`
  - `cancel_url`
  - `allow_promotion_codes: true`
  - `customer` or `customer_email`
- Return `{ url }`.

### Required Stripe Webhook Work

The current `server/stripe-api.mjs` webhook route is a placeholder and does not verify signatures or update the DB. Production must verify `STRIPE_WEBHOOK_SECRET`.

Handle at minimum:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Webhook persistence should update the DB with:
- `user_id`
- `plan`
- `stripe_customer_id`
- `stripe_subscription_id`
- `stripe_price_id`
- `subscription_status` (`active`, `trialing`, `past_due`, `canceled`, etc.)
- `current_period_start`
- `current_period_end`
- invoice/payment state as needed

Important: do not trust `/checkout/success` alone as proof of payment. Subscription activation must come from verified Stripe webhook events.

### Frontend Security Work Already Applied

- `/dashboard/*` is wrapped in `RequireAuth`.
- `/checkout` is wrapped in `RequireAuth`.
- `/checkout/success` is wrapped in `RequireAuth`.
- `/checkout/success` no longer sets `localStorage.aria_authed` or `localStorage.aria_plan`.
- Sign out clears both `aria_authed` and `aria_plan`.
- Pricing sends already-authenticated users to `/checkout?plan=<planId>` instead of `/signup?plan=<planId>`.
- Authenticated users who directly open `/signup?plan=<planId>` are redirected to dashboard or checkout.

These are UX-level protections only. They do not prove identity, payment, or plan entitlement.

### Backend-Only Security Work Still Required

- Replace `RequireAuth` localStorage checks with real Supabase session checks.
- Protect every dashboard/API endpoint with server-side auth.
- Protect desktop app activation/token endpoints with server-side auth and subscription checks.
- On `/checkout/success`, query the backend for subscription status instead of trusting query params.
- Activate paid features only when DB subscription status is `active` or otherwise allowed.
- Use Stripe webhook events, not the success URL, to write subscription status.
- Enforce quota and plan limits server-side.
- Add rate limiting to checkout/session creation endpoints.
- Add idempotency for webhook processing using Stripe event IDs.
- Ensure `planId`, `priceId`, `customerId`, and `subscriptionId` cannot be supplied by the client except where explicitly safe and validated.

### Supabase/DB Integration Targets

Existing TODOs already reference Supabase. Suggested tables/fields:

`profiles`
- `id`
- `user_id`
- `email`
- `name`
- `plan`
- `created_at`
- `updated_at`

`subscriptions`
- `id`
- `user_id`
- `plan`
- `status`
- `stripe_customer_id`
- `stripe_subscription_id`
- `stripe_price_id`
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `created_at`
- `updated_at`

`billing_events` or `stripe_events`
- `id`
- `stripe_event_id`
- `type`
- `user_id`
- `payload`
- `created_at`

### Frontend Places That Need Backend Data Later

- `src/app/pages/dashboard/Billing.tsx`
  - The Billing page is structured around real backend data and must not use frontend example billing rows.
  - It calls `GET /api/billing/overview` through `src/app/lib/billing.ts`.
  - It calls `POST /api/stripe/create-portal-session` for card updates and plan changes.
  - Plan cards are product definitions, but the active/current plan, billing period, payment method, and receipt rows must come from the backend.
  - If the backend is unavailable, the page shows an unavailable/empty state instead of fake payment history.

Required billing overview response:

```ts
type BillingOverview = {
  subscription: {
    plan: "Free" | "Pro" | "Elite"
    price: string
    period: string
    billingPeriod: string
    nextBilling: string
    status: string
    paymentMethod?: {
      type: string // e.g. "Credit Card", "Debit Card", "Crypto"
      label: string // e.g. "Visa ending in 4242"
    }
  } | null
  receipts: Array<{
    id: string
    paymentDate: string
    validUntil: string
    amount: string
    method: string
    status: string
    hostedUrl?: string
  }>
}
```

Backend billing requirements:
- Derive `subscription` from trusted subscription/payment records, not localStorage or query params.
- Derive `receipts` from Stripe payment/invoice data or the backend billing ledger.
- `hostedUrl` should point to a Stripe-hosted receipt/invoice PDF or a backend-secured receipt endpoint.
- Each receipt row must belong to the authenticated user.
- The frontend opens `hostedUrl` when present; otherwise it shows a fallback receipt modal from returned receipt fields.

- `src/app/pages/dashboard/Overview.tsx`
  - Replace mock plan/renewal with real subscription status.

- `src/app/pages/dashboard/Usage.tsx`
  - Enforce plan limits from DB/subscription state.
  - Daily activity table must be backed by real records, not a hard-coded array.
  - The page now calls:
    - `GET /api/usage/summary`
    - `GET /api/usage/daily`
    - `GET /api/interviews/scheduled`
  - `GET /api/usage/summary` must return trusted current billing-period quota usage and plan limits. The Usage quota cards must not use hard-coded values such as `42/70` or `27/50`:

```ts
type UsageSummary = {
  planName: string
  billingPeriod: string
  calls: {
    used: number
    limit: number
  }
  coding: {
    used: number
    limit: number
  }
}
```

  - `calls.used` must be counted from actual billable/current-period interview usage records.
  - `coding.used` must be counted from actual current-period coding session usage records.
  - `calls.limit` and `coding.limit` must come from the user's active plan entitlement, not frontend constants.
  - `GET /api/usage/daily` should return daily aggregates for the authenticated user's full account history, from first purchase/signup through today. The Usage page handles date-range filtering on top of this data:

```ts
type DailyUsageRecord = {
  date: string // YYYY-MM-DD
  calls: number // total calls for backward compatibility
  interview?: number
  phoneCall?: number
  coding: number
}
```

  - The frontend currently combines daily usage records with scheduled interview records by date and renders:
    - `Date`
    - `Interview`
    - `Phone Call`
    - `Coding Sessions`
    - `Scheduled`
  - Production backend may alternatively return a single already-aggregated endpoint with scheduled counts included, but the numbers must come from trusted DB records:
    - calls from completed/charged interview sessions or `usage_logs`
    - coding from coding usage records
    - scheduled from `interview_schedules.scheduled_at`
  - Use `scheduled_at` for the intended scheduled date. Fall back to `created_at`/`savedAt` only for migration compatibility.
  - Overview Activity is only a current-month summary and should not include date-range search.
  - Usage Daily Activity is the full history table and must support date-range search, expanded modal viewing, and Excel-compatible CSV export.

- `src/app/pages/dashboard/Overview.tsx`
  - `Plan Usage` must not use a hard-coded percent.
  - It must be derived from the authenticated user's current plan limits and actual usage counts.
  - Required formula:
    - `callsRatio = callsUsed / callsLimit`
    - `codingRatio = codingUsed / codingLimit`
  - Example limits:
    - Free: `callsLimit = 10`, `codingLimit = 1`
    - Pro: `callsLimit = 70`, `codingLimit = 50`
    - Elite: `callsLimit = 150`, `codingLimit = 100`
  - If backend returns both usage summary and plan limits, frontend may calculate the ratio.
  - If backend returns precomputed ratios, frontend may render those, but backend must still calculate from trusted DB usage/subscription data.
  - Never calculate paid feature entitlement from localStorage, query params, or frontend-only plan labels.

- `src/app/pages/auth/SignUp.tsx`
  - Replace mock signup with Supabase auth.
  - Preserve selected plan during auth handoff.
  - After signup:
    - free → dashboard
    - paid → checkout

- `src/app/pages/dashboard/Settings.tsx`
  - The Settings page no longer uses a frontend mock profile.
  - It calls account endpoints through `src/app/lib/account.ts`.
  - If the backend account endpoints are unavailable, the page must show an unavailable state and must not show fake saved/password-updated/delete-success messages.

Required account settings endpoints:

```ts
GET /api/account/settings

type AccountSettings = {
  profile: {
    name: string
    email: string
    authProvider?: "password" | "google" | "github" | "unknown"
  }
}
```

```ts
PATCH /api/account/profile

type RequestBody = {
  name: string
  email: string
  authProvider?: "password" | "google" | "github" | "unknown"
}
```

```ts
PATCH /api/account/password

type RequestBody = {
  currentPassword: string
  newPassword: string
}
```

```ts
DELETE /api/account

type RequestBody = {
  confirmationEmail: string
}
```

Backend account requirements:
- Every account endpoint must require the authenticated user.
- Users must only read/update/delete their own account.
- Email changes should require the auth provider's verification flow.
- Password changes must verify the current password or require recent reauthentication.
- Social-login users should not be allowed to set/change a local password unless the product explicitly supports linking password auth.
- Account deletion must coordinate profile deletion, token/license invalidation, interview records, usage records, and Stripe subscription/customer handling according to the product retention policy.

- `src/app/pages/dashboard/Support.tsx`
  - This page is displayed as **Help Centre** in the dashboard sidebar.
  - It contains policy-style help guidance plus a real Help Centre ticket form.
  - Submit Ticket is structured around a real support ticket endpoint and must not use fake delayed success.
  - It calls `POST /api/support/tickets` through `src/app/lib/support.ts`.
  - The request body is `multipart/form-data` because the form supports an optional attachment.

Required support ticket endpoint:

```ts
POST /api/support/tickets

FormData fields:
- issueType: string
- subject: string
- description: string
- attachment?: File
```

Backend Help Centre ticket requirements:
- Require the authenticated user.
- Persist ticket records with `user_id`, `issue_type`, `subject`, `description`, `status`, and timestamps.
- Store attachments in a private bucket/object store and link them to the ticket.
- Validate file size/type server-side.
- Send an automatic confirmation email to the user after successful ticket creation. The email should state that the ticket was received and that a support manager will contact them soon.
- Send team notification email so the assigned manager can follow up.
- Return a non-2xx response when ticket creation fails so the frontend does not show fake success.

### Production Security Notes

- Never expose `STRIPE_SECRET_KEY` or Stripe webhook secret to the frontend.
- Do not store raw card data.
- Do not activate paid features based on localStorage or query params.
- Validate the logged-in user before creating Checkout or Portal sessions.
- Verify Stripe webhook signatures.
- Make webhook processing idempotent using `stripe_event_id`.
- Price IDs must come from server config, not from client request body.

---

## Interview Records Integration

The web dashboard now includes `src/app/pages/dashboard/Interviews.tsx` at `/dashboard/interviews`.

Purpose:
- Show interview schedules created from the desktop app.
- Show completed interview sessions saved by the desktop app.
- Let the user delete/cancel records from the web dashboard.
- Let the user open a completed session transcript in the web dashboard.
- The summary cards on the Interviews page are account-level/current-state metrics:
  - `Scheduled`: currently scheduled, not-yet-started interviews as of now.
  - `Completed`: total completed interview sessions for the account.
  - `Interview Time`: sum of all completed session duration for the account.

Current frontend behavior:
- The page calls real API endpoints through `src/app/lib/interviews.ts`.
- It does not use arbitrary mock arrays.
- If the backend endpoints are missing, the page shows an explicit connection error and empty states.

Frontend API client:

```ts
GET    /api/interviews/scheduled
DELETE /api/interviews/scheduled/:id
GET    /api/interviews/sessions
DELETE /api/interviews/sessions/:id
```

Required scheduled interview response:

```ts
type ScheduledCompanyInterview = {
  id: string
  type: "company"
  jobTitle: string
  companyName?: string
  experience: string
  interviewType: string
  language: string
  responseStyle: string
  scheduledAt?: string
  savedAt: string
}

type ScheduledGeneralInterview = {
  id: string
  type: "general"
  partnerName: string
  topic: string
  style: string
  language: string
  focusArea: string
  scheduledAt?: string
  savedAt: string
}
```

Important scheduling note:
- The current DesktopApp model uses `savedAt` for scheduled items.
- Production should add `scheduledAt` for the actual intended interview time.
- Keep `savedAt` as the record creation timestamp.
- The web page renders `scheduledAt` when available and falls back to `savedAt` only for compatibility.
- For current scheduled counts, production should use a trusted schedule status such as `scheduled`, exclude canceled/completed records, and require `scheduled_at >= now()`.

Required completed session response:

```ts
type InterviewSession = {
  id: string
  title: string
  date: string
  duration: number
  messages: Array<{
    role: "interviewer" | "user"
    text: string
  }>
}
```

DesktopApp integration target:
- `D:\Mine\IT\SAAS\ARIA\DesktopApp\src\app\storage.ts` currently stores `aria_scheduled` and `aria_sessions` in localStorage.
- Replace those localStorage functions with authenticated API calls to the same backend records used by this web page.
- Keep the DesktopApp function signatures stable if possible:
  - `saveScheduledItem`
  - `getScheduledItems`
  - `deleteScheduledItem`
  - `saveSession`
  - `getSessions`
  - `deleteSession`

Recommended database tables:

`interview_schedules`
- `id`
- `user_id`
- `type` (`company`, `general`)
- `job_title`
- `company_name`
- `experience`
- `interview_type`
- `language`
- `response_style`
- `partner_name`
- `topic`
- `style`
- `focus_area`
- `scheduled_at`
- `created_at`
- `updated_at`

`interview_sessions`
- `id`
- `user_id`
- `title`
- `started_at`
- `ended_at`
- `duration_seconds`
- `created_at`

`interview_messages`
- `id`
- `session_id`
- `role` (`interviewer`, `user`)
- `text`
- `created_at`
- `sequence`

Security requirements:
- Every interview endpoint must require the authenticated user.
- Users must only read/delete their own schedules and sessions.
- DesktopApp token/license activation must resolve to the same `user_id`.
- Deleting a scheduled item must not deduct interview-call quota.
- Saving a completed interview session may update usage counts server-side according to the user's active plan.

---

## Dashboard

### DashboardLayout — `src/app/pages/dashboard/DashboardLayout.tsx`
- Sidebar: AnimatedLogo → nav items → Download App → user section → Sign Out
- Sign Out: `localStorage.removeItem("aria_authed")` + `navigate("/")`
- Nav: Overview · Usage · Interviews · Billing · Settings · Help Centre
- Mock user: `{ name: "John Smith", plan: "Pro" }` — TODO [SUPABASE:DB]: replace

### Dashboard Pages
- `Overview.tsx` — Stats cards, token key copy/regenerate, usage bar
- `Usage.tsx` — Quota cards with progress, daily history table
- `Interviews.tsx` — Scheduled desktop interviews and completed session history
- `Billing.tsx` — Plan info, payment method, plan comparison, invoices
- `Settings.tsx` — Profile form, password change, delete account
- `Support.tsx` — Help Centre guide and ticket form

---

## TODO Summary

| Tag | Description |
|-----|-------------|
| `TODO [SUPABASE:AUTH]` | Replace localStorage auth with `supabase.auth.*` |
| `TODO [SUPABASE:DB]` | Insert/update profiles, tokens tables |
| `TODO [STRIPE]` | Harden Checkout Session API, add Customer Portal, verify webhooks, persist subscriptions |
| `TODO [EMAIL]` | Send confirmation email on signup (Resend/SendGrid/Supabase Edge) |
