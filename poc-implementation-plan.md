# Telgea White-Label PoC — Implementation Plan

> Audience: coding agent. This document is self-contained — build the PoC from this alone.
> **Multi-session build:** §3 breaks the work into milestones and §4 is a live progress tracker. At the **start** of each session, read §4 and continue from "Next up". At the **end** of each session, tick completed items and update the status block. Keeping the tracker in this file is what lets the build survive across context windows.

---

## 1. What this is (and isn't)

A clickable, self-contained front-end prototype that demonstrates the **user journey** for a white-label mobile plan (example partner: **FC Barcelona**) and makes the **behind-the-scenes flow visible** through a mock backend console.

It is a **communication/demo artifact**, not a working telecom product. Everything is mocked deterministically in the browser.

**Explicitly out of scope (mock only, never real):** eSIM provisioning, carrier/network calls, payments, auth backend, persistence beyond the session.

**Design goal:** a product/architecture reviewer watching a screen recording should be able to follow the full journey _and_ understand what happens behind the scenes, without any telecom expertise.

---

## 2. Stack & structure

- **Vite + React + TypeScript + Tailwind CSS.** Single-page app, no backend, no router.
- All state lives in React — drive the whole thing from **one state machine** (a `useReducer` hook or equivalent). No real network calls; `setTimeout` simulates async steps.
- **Deterministic:** the same clicks always produce the same logs. A `Reset` control returns to the start and clears logs.
- Built for **desktop screen recording** (Loom). Three columns side by side.
- Split components by pane, but keep it one app.

---

## 3. Build plan (milestones)

Build in this order — each milestone is independently testable and builds on the last. M3 gives a demoable happy path early; M4–M5 add depth; M6 polishes.

| ID     | Milestone                             | Goal                                                                                                                      | Covers (sections)              | Done when                                                                 |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------- |
| **M1** | Project shell                         | Runnable app with the three-pane frame and top-bar controls in place (controls may be inert)                              | Layout                         | App runs; three panes visible; Reset clears                               |
| **M2** | State machine + console engine        | Central reducer, log emission on state entry, timestamps + actor tags, timer helper                                       | Console log style, Build notes | Transitions emit correctly-tagged, timestamped logs; console auto-scrolls |
| **M3** | Buy journey — happy path (gating OFF) | Full buy flow to `ACTIVE`, including the async install timer                                                              | Buy journey, Mock data         | Buy flow completes end-to-end; logs read as a coherent sequence           |
| **M4** | Gating + edge scenarios               | Membership gating path, `BLOCKED`, membership-fail scenario, install-not-confirmed → SMS fallback; top-bar controls wired | Buy journey, Layout (controls) | All three scenarios reachable from the top bar and behave per spec        |
| **M5** | Manage journey                        | Re-auth, usage dashboard, top-up, change/cancel, grace note                                                               | Manage journey                 | Manage reachable from Column A and the `ACTIVE` screen; all actions log   |
| **M6** | Branding & finish                     | Partner branding on Column B, brand/console contrast, final mock data, out-of-scope footer                                | Layout, Mock data, Build notes | Column B clearly branded; footer present. Stretch: second partner switch  |

---

## 4. Progress tracker

> Update this section as you build. This is the source of truth for what's done.

**Status**

- Current milestone: **DONE** — all milestones (M1–M6) complete
- Last completed: **M6 — Branding & finish** (2026-07-03)
- Next up: _—_
- Notes / decisions made during build:
  - **M1** — Stack: **Vite 6 + React 18 + TS + Tailwind v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js`/PostCSS; theme tokens in `src/index.css` under `@theme`). Layout in `src/App.tsx`: top bar + 3-col grid (`340px 1fr 1fr`) + footer. Panes in `src/components/`. Brand data + shared types in `src/types.ts`; brand colours applied via **inline styles** so a second partner re-skins instantly.
  - **M2** — State machine lives in `src/machine/`: `types.ts` (all `StateId`s + `STATE_LABELS`), `entryLogs.ts` (on-entry log registry), `machine.ts` (pure `reducer` + `initialState`), `useJourney.ts` (hook wrapping the reducer + reset-safe timer helper).
    - **StrictMode-safe by design:** logs are emitted either (a) on-entry, appended *inside* the pure reducer's `GOTO` (double-invoke → identical result, no dup), or (b) async/staggered, scheduled from **event handlers** via the timer helper (handlers don't double-fire). No log-emitting effects.
    - `tMs` is stamped in the reducer relative to `startAt` (first log after reset); `nextLogId` lives in state so the reducer is self-contained/pure. Actions carry `at: performance.now()` so the reducer takes no wall-clock itself.
    - Timer helper (`schedule`/`runSequence`) registers timeouts in a ref, **cleared on reset + unmount** → deterministic, no leaks.
    - Console auto-scrolls to newest line (effect on `logs`); per-actor colour map already in `Console.tsx`.
    - `PlanPage` is now **state-driven** (IDLE = branded intro; other states = labelled placeholder). M3/M5 replace placeholders with real branded screens.
    - **Engine harness:** `DevPanel` (rendered only with `?dev` in URL) exercises the primitives; not part of the demo surface, removable later.
    - App wires the two entry transitions (`goto('EMAIL_ENTRY')`, `goto('MANAGE_AUTH')`); Reset uses `journey.reset()`. Demo settings (brand/gating/scenario) stay in App state and **persist across Reset**.
  - **Verified M2:** `npm run build` clean; 22/22 reducer assertions pass (tagged/timestamped emission, relative timing, determinism, purity, reset — via esbuild-bundled node test); CDP confirms 6 distinct actor colours, staggered timestamps (t+0.5s→t+2.5s), and auto-scroll-to-bottom; screenshot confirms console log style.
  - **M3** — Buy happy path (gating OFF) complete end-to-end: `EMAIL_ENTRY → OTP_SENT → COUNTRY_SELECT → PLAN_SELECT → PAYMENT → PROVISIONING → INSTALL_INSTRUCTIONS → INSTALL_PENDING → ACTIVE`.
    - Mock data in `src/data.ts` (COUNTRIES Spain/Germany/Austria each with 3 plans, `DEMO_OTP=123456`, `MOCK_ICCID`, `INSTALL_TIMER_MS=5000`, `PROVISION_STEP_MS=550`, `msisdnFor`/`planLabel` helpers). Deterministic — msisdn derived from country dial code.
    - Buy-flow handlers in `src/machine/buyFlow.ts` (`createBuyActions(journey, brand, gating, scenario)`): user-action logs emitted via `log()` from handlers, system/consequence logs via `entryLogsFor`, staggered carrier lines via `runSequence`, install confirmation via `schedule`. Partner name flows through `data.partnerName` so on-entry logs can reference "FC Barcelona".
    - Screens in `src/screens/` (`EmailEntry`, `OtpEntry`, `CountrySelect`, `PlanSelect`, `Payment`, `Provisioning`, `InstallInstructions`, `InstallPending`, `Active`) + shared `ui.tsx` (`BrandButton`, `Spinner`, `QrCode` deterministic mock QR, `CheckBadge`, layout wrappers). `PlanPage` routes on `stateId`; unbuilt states still show the labelled placeholder.
    - **Verified M3:** `npm run build` clean; CDP drove the full path to ACTIVE — 18-line coherent console sequence, provisioning staggered t+0.9→t+3.1s, install timer fired 5s later (t+3.6→t+8.6s), number `+34 600 123 456` shown; screenshots confirm branded screens + mock QR + success screen.
  - **M4** — Gating + all three edge scenarios wired through the top-bar controls.
    - Gating ON: `submitEmail` → `MEMBERSHIP_CHECK` (spinner + on-entry Partner log "Checking membership with …"), then after `MEMBERSHIP_CHECK_MS` resolves pass → `OTP_SENT` ("Confirmed: active … member") or fail → `BLOCKED` ("No active membership found…"). Pass rule: `scenario !== 'membership-fail'` **or** email in `MEMBER_ALLOWLIST` (`member@fcb.com` always passes — §8).
    - Install-not-confirmed: `confirmInstall` timer branches on scenario → `SMS_FALLBACK` (logs "No confirmation received → sending SMS fallback instructions" + a "less reliable" note), screen offers "Simulate text from the new SIM" → `simulateSms` logs "SMS received…" → `ACTIVE`.
    - New screens: `MembershipCheck`, `Blocked`, `SmsFallback`; membership actor tag = **Partner** (shows the partner boundary).
    - **QR alternative (user request):** `InstallInstructions` redesigned — primary **"Install on this iPhone"** one-tap (universal-link install; the user is usually on the same phone that needs the eSIM, so a QR they'd scan with that same phone is useless), QR demoted to an "on another device" fallback. Entry log updated to "eSIM activation offered (one-tap install on device, or QR)". Both paths call `confirmInstall`.
    - **Verified M4 (CDP):** membership-fail → BLOCKED (+ correct logs); membership pass → OTP; allowlist `member@fcb.com` overrides fail → OTP; one-tap install works; install-not-confirmed → SMS fallback → simulate → ACTIVE. Screenshots confirm all three surfaces.
  - **M5** — Manage journey complete. Actions in `src/machine/manageFlow.ts` (`createManageActions`).
    - `openManage` (Column A "Manage my plan") skips re-auth when `data.signedIn`, else → `MANAGE_AUTH`. From the ACTIVE screen `goManage` → `MANAGE_HOME` directly (already signed in).
    - `MANAGE_AUTH` = `ManageAuth` screen reusing `EmailEntry`+`OtpEntry` (local step state); logs "One-time code sent" then "Returning user re-authenticated" → `MANAGE_HOME`.
    - `MANAGE_HOME` = `ManageHome`: current plan + static usage bar (`MOCK_USAGE` 3.2/10 GB), Top up ("Top-up purchased"), Change plan (inline reuse of `PlanSelect` → "Plan changed: …", patches `data.plan`, stays in state), Cancel (confirm → "Plan cancelled" → `CANCELLED`). Top-up/change-plan patch state via `goto('MANAGE_HOME', patch)` (no on-entry logs → no dupes).
    - Membership-loss edge: "Simulate: membership ended" → logs Partner "Membership ended for this user" + Telgea "7-day grace period started …" → `CANCELLED` with `cancelReason:'membership'`; `Cancelled` screen shows the 7-day grace note (vs plain "Plan cancelled" for user cancel).
    - **Verified M5 (CDP):** cold Column-A entry → re-auth → dashboard → top-up/change(→25GB)/cancel all log correctly; ACTIVE→Manage skips re-auth and carries the bought plan; membership-ended → grace screen + logs. Screenshots confirm dashboard (usage bar) + grace screen.
  - **M6** — Branding & finish complete.
    - Real assets: `src/assets/fcb.webp` (crest) via `BrandMark`; `src/assets/telgea.png` (lime mark) via `TelgeaMark`. FCB colours updated to primary `#0A0927` / accent `#FDC52C` (+ `onAccent` for readable text on accent). Brand gained `logo`, `webHost`, `colors.onAccent`.
    - **Two-windows** treatment: three framed windows (rounded + shadow + gap on a slate desktop). Column A = phone (status bar 9:41 + signal/wifi/battery); Column B = browser (chrome bar + lock + Telgea-hosted URL `fcbarcelona.telgea.com`); Column C = terminal.
    - **Telgea presence** (per request, overrides the old "Telgea never in Column B" rule): "powered by Telgea" footer in Column B, the Telgea-hosted URL, the console header lockup, and the top-bar lockup.
    - **SMS-fallback corrected:** shows a Telgea-owned verification number (`TELGEA_VERIFY_NUMBER`) + a user-identifying code (`VERIFY_CODE`); the user texts the code from the new line, and the code arriving at the Telgea number FROM the assigned MSISDN proves the new line is live. Logs + screen rewritten accordingly.
    - **Removed PoC narration:** DevPanel + `?dev` deleted; state-placeholder/"built in a later milestone", "Deterministic front-end mock" footer, "Demo code" hint, "Use Reset", "no logged-in context" caption, "Mock card" all removed. Footer now the §10 out-of-scope list.
    - **Stretch done:** 2nd partner **PSG** in `BRANDS` — brand selector re-skins Column A/B instantly (colours, plan prefix, URL, initials mark).
    - **Verified M6:** `npm run build` clean; screenshots confirm FCB + PSG idle, install (one-tap + QR), corrected SMS verification (+ correct logs), and manage dashboard.

**Checklist**

**M1 — Project shell** ✅

- [x] Vite + React + TS + Tailwind initialised, runs locally
- [x] Three-column layout (Partner app / Plan page / Console)
- [x] Top bar: brand selector, gating toggle, scenario selector, Reset
- [x] Console component renders tagged, timestamped lines
- [x] Reset clears state + logs

**M2 — State machine + console engine** ✅

- [x] Central reducer / state-machine hook with all state IDs stubbed
- [x] Log emission on state entry (actor tag + relative timestamp)
- [x] Timer helper for async steps
- [x] Console auto-scrolls; colour/tag per actor

**M3 — Buy journey, happy path (gating OFF)** ✅

- [x] EMAIL_ENTRY → OTP_SENT → COUNTRY_SELECT → PLAN_SELECT → PAYMENT
- [x] PROVISIONING sequence with staggered logs
- [x] INSTALL_INSTRUCTIONS (mock QR) → INSTALL_PENDING (timer) → ACTIVE
- [x] Mock data wired (countries, plans, OTP 123456)
- [x] Full happy path completes end-to-end

**M4 — Gating + edge scenarios** ✅

- [x] Gating ON path: MEMBERSHIP_CHECK, BLOCKED
- [x] Scenario: membership fails
- [x] Scenario: install not confirmed → SMS fallback → ACTIVE
- [x] Top-bar toggle + scenario selector drive behaviour
- [x] Install screen: one-tap "Install on this device" primary + QR fallback (same-phone fix)

**M5 — Manage journey** ✅

- [x] MANAGE_AUTH (OTP re-auth / skip if already in session)
- [x] Dashboard with usage bar
- [x] Top up, change plan, cancel
- [x] 7-day grace message + log on membership-driven cancel

**M6 — Branding & finish** ✅

- [x] Column B wears partner brand (colour, real crest, plan names)
- [x] Console/brand contrast obvious (light branded windows vs dark terminal)
- [x] Out-of-scope footer (§10 list)
- [x] (Stretch) second mock partner (PSG) via brand selector
- [x] Real FC Barcelona crest + Telgea mark (top bar, Column B "powered by", console)
- [x] Panels styled as distinct windows (phone / browser / terminal)
- [x] SMS fallback corrected (Telgea verification number + user code)
- [x] PoC-narrating annotations removed

---

## 5. Layout

**Top bar — demo controls:**

- **Partner brand** selector — default `FC Barcelona`. (Stretch: a second mock partner to show the same page re-skins instantly — reinforces the white-label point.)
- **Membership gating** toggle — "Partner requires membership" ON/OFF.
- **Scenario** selector — `Happy path` / `Membership check fails` / `Install not confirmed (SMS fallback)`.
- **Reset** button.

**Column A — "Partner App"** (partner-branded):

- Mock app home with a promo card: _"Get the FC Barcelona mobile plan"_ + a CTA button.
- A secondary _"Manage my plan"_ link.
- Small caption: _"The same entry point can be an email or the partner's website"_ — signals cold entry (no logged-in context).

**Column B — "Plan page"** (wears the partner brand; the word "Telgea" never appears here):

- Where the actual buy/manage flow renders, step by step. This is the surface the user sees.

**Column C — "Behind the scenes"** (console):

- Timestamped, plain-language log lines, tagged/coloured by actor: `Partner` / `Telgea` / `Payment` / `eSIM` / `Network` / `Notify`.
- Timestamps relative (e.g. `t+0.4s`).

**The core visual story:** Column B is unmistakably FC Barcelona; Column C reveals Telgea powering it. Make that contrast obvious — it _is_ the white-label pitch.

---

## 6. Buy journey — state machine

Each state defines: what Column B shows, the log line(s) emitted **on entry**, and the transitions out. Provisioning steps fire ~400–600ms apart so the console reads like a live sequence.

| #   | State                  | Column B shows                                                                                   | Logs emitted                                                                                                              | → next                                                                                                                                |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `IDLE`                 | (empty / branded placeholder)                                                                    | —                                                                                                                         | CTA in Column A → `EMAIL_ENTRY`; log: `Partner CTA clicked → opening branded plan page (powered by Telgea)`                           |
| 2   | `EMAIL_ENTRY`          | Branded intro + email field + "Continue"                                                         | `Email submitted`                                                                                                         | gating ON → `MEMBERSHIP_CHECK`; gating OFF → `OTP_SENT`                                                                               |
| 3   | `MEMBERSHIP_CHECK`     | Spinner: "Verifying your FC Barcelona membership…"                                               | `Checking membership with FC Barcelona`                                                                                   | happy → `Confirmed: active FC Barcelona member` → `OTP_SENT`; fail scenario → `No active membership found for this email` → `BLOCKED` |
| 4   | `OTP_SENT`             | "We sent a 6-digit code to {email}" + code input                                                 | `One-time code sent (demo code: 123456)`                                                                                  | correct code → `Code verified → account created & signed in` → `COUNTRY_SELECT`                                                       |
| 5   | `COUNTRY_SELECT`       | Country dropdown                                                                                 | `Country selected: {country}`                                                                                             | select → `PLAN_SELECT`                                                                                                                |
| 6   | `PLAN_SELECT`          | 2–3 plan cards for the country                                                                   | `Plan selected: {plan}`                                                                                                   | select → `PAYMENT`                                                                                                                    |
| 7   | `PAYMENT`              | Mock card form + "Pay"                                                                           | `Payment authorised (Stripe)` · `Telgea recorded as merchant of record` · `Revenue share recorded for FC Barcelona`       | pay → `PROVISIONING`                                                                                                                  |
| 8   | `PROVISIONING`         | "Setting up your line…"                                                                          | `Provisioning started` · `Phone number assigned: {msisdn}` · `eSIM profile requested from carrier` · `eSIM profile ready` | auto → `INSTALL_INSTRUCTIONS`                                                                                                         |
| 9   | `INSTALL_INSTRUCTIONS` | Mock QR + "Scan to install your eSIM" + "I've installed it"                                      | `Activation QR shown to user`                                                                                             | button → `INSTALL_PENDING`                                                                                                            |
| 10  | `INSTALL_PENDING`      | "Activating your line… this can take a few minutes. You can close this page — we'll notify you." | `Waiting for install confirmation (in production this can take ~15 min)`                                                  | see below                                                                                                                             |
| 11  | `ACTIVE`               | Success: "Your FC Barcelona line is live" + number + link to Manage                              | `Line active — install confirmed` · `Notified FC Barcelona: plan activated` · `Journey complete`                          | Manage link → manage flow                                                                                                             |
| —   | `BLOCKED`              | Friendly block: "This offer is for FC Barcelona members"                                         | —                                                                                                                         | Reset only                                                                                                                            |

**`INSTALL_PENDING` behaviour (async confirmation):** start a demo timer (~5s, representing the real ~15min).

- **Happy path:** timer fires → `ACTIVE`.
- **Install-not-confirmed scenario:** timer expires with no confirmation → log `No confirmation received → sending SMS fallback instructions` → Column B shows _"Text START to {number} to finish activation"_ + a "Simulate text from the new SIM" button → on click: `SMS received from the new number → install confirmed` → `ACTIVE`. Console note: _fallback, less reliable_.

**Note (do not build, reference only):** when a user arrives from inside the already-logged-in partner app carrying a signed token, steps 2–4 can be skipped (auto-create + sign in). Email + OTP is the universal path because it also covers cold entry (email/website).

---

## 7. Manage journey

Entry from Column A "Manage my plan" or from the `ACTIVE` success screen.

- `MANAGE_AUTH` — email → OTP (reuse step 4). Log: `Returning user re-authenticated`. Skip if already signed in this session.
- `MANAGE_HOME` — dashboard:
  - **Usage:** e.g. "3.2 / 10 GB used this cycle" + a simple bar.
  - **Top up** (if plan is prepaid) → `Top-up purchased`.
  - **Change plan** → plan picker (reuse step 6) → `Plan changed`.
  - **Cancel plan** → confirm → `Plan cancelled`.
- **Grace period:** when cancellation is driven by lost membership, show _"Your plan stays active for 7 days"_ and log `Membership ended → 7-day grace period started`. Display only — no live countdown needed.

---

## 8. Mock data

- **Partner:** FC Barcelona — name, brand colour (blaugrana), logo placeholder, plan-name prefix "Barça Mobile".
- **Membership:** in the _fail_ scenario force a fail; otherwise pass. (Optional allowlist e.g. `member@fcb.com` passes.)
- **OTP:** demo code `123456`, also surfaced in the console.
- **Countries:** Spain, Germany, Austria — each with 2–3 plans.
- **Plans (example):** `Barça Mobile 10GB — €12/mo`, `Barça Mobile 25GB — €18/mo`, `Barça Mobile Unlimited — €29/mo`.
- **Line identifiers:** generate a mock phone number and a serial-like string for display; don't explain them on screen.
- **Usage:** static numbers.

---

## 9. Console log style — important

Plain, functional language a **product person** would use. Show the three boundaries — **partner ↔ Telgea ↔ carrier** — at a high level. **Do not** invent detailed telecom internals or protocol/component names (no `SM-DP+`, `CDR`, provider-framework internals, etc.). The console should feel honest about the abstraction, not perform false expertise.

**Good lines:** `Partner CTA clicked → opening branded plan page` · `Checking membership with FC Barcelona` · `One-time code sent` · `Payment authorised (Stripe)` · `Telgea recorded as merchant of record` · `eSIM profile requested from carrier` · `Waiting for install confirmation (~15 min in production)` · `Notified FC Barcelona: plan activated`.

Tag each line by actor and give it a relative timestamp.

---

## 10. Out of scope — show in a small footer

Acknowledge these as real considerations handled outside the PoC: real provisioning & network; number porting; the operator name shown in the device status bar; per-country KYC / SIM registration; database & tenancy design; real Stripe/Connect; production auth.

---

## 11. Build notes

- One state machine drives all three panes. Each state = { Column B view, entry log lines, transitions }.
- `setTimeout` simulates async (provisioning sequence + install confirmation).
- No router — views are state-driven. Keep components small.
- `Reset` returns to `IDLE` and clears the console.
- Prioritise clarity of the flow over visual polish; the reviewer is grading thinking.
