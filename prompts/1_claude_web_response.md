Strong start overall — your central instinct is correct, and it's the thing most people miss: **the entire right-hand side of that diagram stays untouched.** The Provider Platform, Provider Framework, the operator clouds, SM-DP+, SIM Stock, ETL — none of it changes. White-label is almost entirely a _left-side_ problem: a thin partner-facing edge plus extensions to the Hub (identity, billing, catalog, webhooks). Leading with "we reuse the whole provisioning and network stack and add a thin layer on the Open API" is a great framing to open your answer with, because it shows you read the architecture correctly.

Let me clear up the unfamiliar terms first, because walking in fluent here will help you a lot:

- **ICCID** — the serial number of the SIM/eSIM profile. **MSISDN** — the actual phone number.
- **SM-DP+** — the GSMA component (in each operator cloud on your diagram) that generates and delivers the eSIM _profile_ to the device. This is what produces the thing the user installs.
- **Tata MOVE** — Tata Communications' global connectivity/aggregation platform. It gives Telgea multi-carrier reach without direct deals with every operator.
- **MVNE (#X)** — Mobile Virtual Network Enabler: provides the backend (provisioning, billing mediation, OSS/BSS) that lets you operate like a carrier without owning spectrum. Telgea is effectively an MVNO/aggregator sitting on top of MVNEs. "#X" is just a placeholder for "some Nth enabler."
- **REST/SOAP/SFTP** — the mismatched protocols different operators expose (modern REST, legacy SOAP, or nightly file drops over SFTP). The Connectivity + Normalization layers hide that mess behind one interface.

You're right that white-label doesn't touch any of this. The one thing to add: your current plans are enterprise-negotiated, so you'll likely need a **consumer plan catalog** (retail pricing, consumer-sized data buckets), which is a Hub/Billing artifact, not a provider one. Your claim holds.

## Where your thinking has gaps

**The biggest one: the tenancy and identity model.** Today the model is Company → Team → User(employee) → Number, with enterprise auth/RBAC and company invoicing. White-label users are self-service _consumers_. That breaks three things at once:

- **Auth** — the existing Auth+RBAC is built for admin-provisioned employees, not consumer self-signup. New surface.
- **Billing** — enterprise invoicing → per-user card subscriptions _plus revenue share back to the partner_. Stripe is already wired in, but you need **Stripe Connect** (partner as a connected account, Telgea takes an application fee = its cut). You skipped this entirely, and it's central — the revenue share you cite in your value prop has to live somewhere in the architecture.
- **Merchant of record / KYC** — who's the licensed, tax-collecting party? You almost certainly want Telgea to be MoR so the partner never has to become a telco. This also matters for the geography question below.

A partner probably _does_ map onto the existing "Company" entity (a special tenant type), which is convenient — but the users hanging off it behave nothing like employees. Foreground this remapping; it's the most architecturally interesting part of the answer.

**Membership verification — there's a cleaner pattern than yours.** Your email-lookup-API + OTP works, but it's a bespoke integration per partner (contradicting your "minimize partner effort" goal) and it's a two-round-trip flow. The stronger answer is a **signed launch token**: when the fan taps "Get your plan" inside the FC Barcelona app, the partner mints a short-lived JWT containing user ID, membership tier, and optionally email/phone, and passes it to your entry URL. Telgea verifies the signature. That gets you identity + entitlement + SSO in a single hop, with near-zero partner effort (signing a JWT is trivial and they already know who's logged in). No separate OTP needed for purchase. Offer full **OIDC/"Login with FC Barcelona"** as the premium option for partners who have an identity provider, and keep your API-callback as the fallback for those who don't. Present it as a menu, not one path.

**eSIM install confirmation — you're conflating two different signals.** "Profile installed" and "line active on the network" are separate events. The 15-minute lag your founder described is almost certainly _first-usage CDR / network attach_ data. But the RSP standard (SGP.22) defines **profile download/install notifications** at the SM-DP+ layer — that signal generally exists near-real-time; the real question is whether Tata MOVE surfaces it to you. So: subscribe to the install notification if available, and **don't block the user on the page either way.** Show an optimistic "activating…" state, let them leave, and confirm asynchronously via push/SMS once the signal arrives. Your "text this number from the new SIM" trick is clever but fragile (requires the user to have selected the new line as default sender, wifi/dual-SIM confusion, etc.) — keep it as a _fallback_ for stubborn cases, not the primary mechanism.

**The "FC Barcelona as network provider" point — you're understating the constraint.** The operator name in the status bar is the SPN/network name baked into the eSIM profile by the carrier, not something Telgea sets in software. Whether an MVNO brand can appear there depends on the underlying operator provisioning a custom SPN, and it varies by carrier. So this is a _profile-provisioning_ question with the operator, not an app-layer task, and often you simply won't get it. Everything _in-app_ is fully brandable; the status bar frequently is not. Say it precisely — it signals depth.

**Geography — your assumption is reasonable, but name the fork.** Two models exist: a **local profile per market** (user selects country → country-bound plan, your assumption) versus a **single global roaming profile** (like Airalo — no country step, simpler UX, different margin). For a worldwide fan base, the roaming model might actually be the _simpler_ product. Either way, the real constraint you'd score points for raising is **per-country KYC/SIM-registration rules** (Spain and Germany both require identity registration for activation). "Global availability" isn't just a catalog question, it's a compliance-per-market question — right in your wheelhouse given your regulatory background.

**A few lifecycle edges you haven't raised** (mentioning even two shows seniority): what happens to the line when someone _stops_ being a member — cancel, or grace period? Number portability in/out (the diagram explicitly mentions porting). And support ownership — when the SIM breaks, does the fan call FC Barcelona or Telgea?

## Value proposition

Your three are solid. Additions worth having:

- **Telco economics without becoming a telco** — the partner gets a recurring revenue line while Telgea absorbs MoR, compliance, and support. This is the "why not DIY" answer.
- **Retention on the _core_ membership** — a phone number is extremely sticky (switching cost, tied to identity), so it reduces churn on the whole club membership, not just the plan.
- **Upsell lever** — bundle free data with higher membership tiers to drive tier upgrades.

One caution on your "direct line via phone number" point: using the mobile line as a marketing channel is a GDPR/ePrivacy minefield. Position it as an _opted-in engagement channel_, not a free SMS list. And name the counter-risk for balance: white-label means **the partner's brand absorbs Telgea's operational failures** — bad connectivity gets blamed on FC Barcelona. Partners will ask about this; showing you see it builds credibility.

## The PoC

Your three-pane concept is the right call — and the backend console is **not** "optional but nice," it's the most valuable pane for this audience. It's what makes the invisible architecture legible and proves you understood the system. Promote it to first-class and:

- Mock the backend as a state machine that emits **the actual component names from their diagram** — Open API → Workflow Execution → Provider Framework → SM-DP+ profile generated → install notification → Consumption Monitoring → Billing → partner webhook. Using their own terms in your logs is a huge tell that you absorbed the architecture.
- Show the **signed-token handoff** (partner mints JWT → Telgea verifies) and a **membership-gated toggle** so the optional-verification branch is visible.
- Show the **async install confirmation** (optimistic state → later "line active" event) rather than a blocking step — demonstrates you got the latency problem.
- If you have time, show one **edge case** in the console (membership check fails, or install-not-confirmed → SMS fallback). One failure path signals senior thinking more than a polished happy path.

Keep it a single self-contained React app, no real eSIM, deterministic mock — don't reach for anything AI-powered here; a defined flow demos better when it's predictable. You're right that it can't be "real," and you shouldn't pretend otherwise.

Want me to sketch the event/state model for the console (the exact sequence of mock log lines mapped to their components), or draft the tiered-integration framing as a one-pager you can drop into the deliverable?
