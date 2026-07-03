# Telgea Assignment — Approach & Decisions

> **How I worked / how to read this:** I developed the approach, both user journeys, the membership-verification design, the value proposition, and the PoC concept myself. I then used an AI assistant as a thinking partner to pressure-test the design and surface gaps I'd missed. Each point below is tagged for origin — **[Mine]** = my own thinking · **[Refined]** = my starting point, sharpened in review · **[AI-surfaced]** = a gap I hadn't flagged, raised in review. **Every final decision is mine.**

---

## The assignment

Let partners (brands / clubs like FC Barcelona) sell **white-label mobile plans** to their fans ("users"), powered by Telgea behind the scenes. Propose the integration, the user journey, the partner value — and a PoC.

---

## Core insight **[Mine]**

**The carrier side of the architecture doesn't change.** Provisioning, SIM stock, network integrations — all reused as-is. White-label is a **thin partner-facing edge + Hub extensions** (identity, billing, catalogue, webhooks). Partner effort stays minimal: they surface a **CTA** and redirect users to a **Telgea-owned, partner-branded page**. All business logic stays with Telgea.
_In review: insight validated against the architecture; unfamiliar diagram terms (ICCID, MSISDN, SM-DP+, Tata MOVE, MVNE) decoded so I could place the integration correctly. [AI-surfaced]_

---

## User journey **[Mine]**

**Buy:** discover (app / email / site) → branded page → _[membership check]_ → verify email (OTP) → select country → select plan → pay → install eSIM → line active.

**Manage:** branded page → re-auth (OTP) → view usage · top up · change / cancel plan.

---

## Gaps → decisions

| Topic                           | My starting point                                      | Surfaced on review                                                                                                      | My decision                                                                                    | Origin      |
| ------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| **Identity / tenancy**          | Reuse existing auth                                    | Current auth is company-bound (employees), not consumer self-signup                                                     | Passwordless **email + OTP** self-signup (auto-creates account). DB/tenancy detail → tech team | AI-surfaced |
| **Membership check**            | **My design:** email → partner API → OTP               | AI proposed a partner-app token (SSO) alternative; **I countered** that it breaks on cold entry (email / website links) | Keep **my email → partner-API → OTP** as primary. Token/SSO kept as reference fast-path        | Mine        |
| **Billing / rev-share**         | Assumed workable                                       | Needs **Stripe Connect** (partner = connected account, Telgea takes a fee)                                              | Stripe Connect; **Telgea = merchant of record**                                                | AI-surfaced |
| **eSIM confirmation**           | **My idea:** "text the number" trick                   | Install-signal ≠ network-active; ~15-min lag; shouldn't block the user                                                  | **Optimistic "activating" + async confirm.** My SMS trick kept as fallback                     | Refined     |
| **Geography**                   | **I flagged** global vs country-bound as an open doubt | AI added the per-country KYC / SIM-registration angle                                                                   | **Scope each plan to one user-selected country**                                               | Refined     |
| **Lifecycle edges**             | Not considered                                         | AI raised membership loss, porting, support ownership                                                                   | **7-day grace** on membership loss; **Telgea owns support**; porting deferred                  | AI-surfaced |
| **Operator name in status bar** | **I flagged** it as a possible issue                   | AI clarified it's a carrier profile-provisioning matter, not app-layer                                                  | **Open question**, out of PoC scope                                                            | Refined     |

---

## Value to the partner

**My three [Mine]**

- Stronger, daily brand relationship with fans.
- A direct line to the user (their phone number).
- Low-effort added revenue (via rev-share).

**Added in review [AI-surfaced]**

- Recurring revenue with **no telco or compliance burden** (Telgea = merchant of record + support).
- **Retention:** a phone number is sticky, which strengthens the _core_ membership.
- GDPR-aware framing of the phone-number channel (opt-in, not a free SMS list).

**My refinement [Mine]**

- Stickiness cuts **both ways** — do users trust FC Barcelona enough to move their _main_ number to it? → start with a **secondary line**; don't prioritise porting at launch.

---

## The PoC

Three panes: **Partner app → Branded plan page → "Behind the scenes" console.** **[Mine]**
The console reveals **Telgea** powering a page the user only ever sees as **FC Barcelona** — that contrast is the whole point. _Promoting the console from "nice-to-have" to a first-class reveal came out of review. [AI-surfaced]_

Shows: membership gating (toggle), email + OTP auth, country / plan / pay, **async install confirmation**, and edge cases (**membership fail**; **install-not-confirmed → SMS fallback**). Deterministic mock — no real provisioning.

_Logs kept plain, not deep telecom jargon — honest about the abstraction rather than performing expertise I don't have._ **[Mine]**

---

## Deliberately left open **[Mine — my calls]**

- **DB / tenancy model** → tech team.
- **Per-country compliance / KYC** → needs telecom + legal input.
- **Operator name in the status bar** → carrier-dependent.
- **Number porting** → deprioritised (trust + stickiness reasons above).
