# Telgea Assignment

This repository contains my solution to the Telgea white-label assignment: enabling Brand Partners (eg. FC Barcelona) to sell mobile plans to their own fans under their own brand, while Telgea powers the connectivity and operations behind the scenes.

**[Loom walkthrough](https://www.loom.com/share/bb881074407b4d849507d6b3c06425b8)**

**[PoC Web App](https://telgea-assignment.vercel.app/)**

## Contents

- [/app](/app) includes the PoC code. React app created with Claude Code (Opus 4.8).
- The prompts I used are stored in [/prompts](/prompts). Note that I started off in Claude Web, where I presented the assignment and my initial thought process to Claude, with the goal of developing an implementation plan for Claude Code. I also included the responses of the Claude Web agent there. Prompts are sorted chronologically (1-9).
- In one of the prompts, I asked Claude to summarize my approach into a file, so that it's easier to trace which parts of the solution are coming from myself, and where Claude stepped in: [approach-and-decisions.md](/approach-and-decisions.md)
- [This implementation plan](/poc-implementation-plan.md) was the output of my web session. As you can see from the prompts, I gave very little additional instructions within the Claude Code session.

## Exploring the PoC

The PoC is a front-end prototype. Everything on the backend (provisioning, payments, eSIM install, network) is mocked deterministically in the browser, so there is nothing to configure.

Link to PoC: https://telgea-assignment.vercel.app/

The screen is split into three panes, which is the core idea of the demo:

- **Partner App:** a mock FC Barcelona app, where the Fan discovers the offer and taps the CTA.
- **Plan page:** the Telgea-owned, partner-branded page where the Fan buys and manages the plan. The Fan only ever sees the FC Barcelona brand here.
- **Behind the scenes:** a console that logs what happens on Telgea's side at each step. This is the pane that makes the invisible part visible, and shows that Telgea powers a page the Fan experiences as FC Barcelona.

Demo controls in the top bar:

- **Partner brand:** switches the branding, to show the same page scales across partners.
- **Membership gating (on/off):** toggles whether the partner requires membership verification.
- **Scenario:** happy path, membership check fails, or install not confirmed (which falls back to SMS confirmation).
- **Reset:** returns to the start and clears the console.

Suggested path: run the happy path first, then switch on membership gating, then run the "install not confirmed" scenario to see the SMS fallback.

## Chosen approach

Brand Partner redirects the user from their app / website to a branded website owned by Telgea (eg. fcbarcelona.telgea.com). From there, users can purchase and manage their mobile plans. I selected this approach because I optimized for minimum technical effort on the partner's side. With my solution, Telgea owns almost all of the technical platform, and the partner only needs to perform minimal technical implementation effort.

The alternative would have been to have the integration living inside of the partner's app. This way, the user never leaves the partner's universe. There are some benefits to this, such as simpler membership verification. However, this approach requires the partner to do much more implementation effort, and requires Telgea to maintain SDKs including documentation and support across platforms.

## Technical integration

Since Telgea already has all of the technical infrastructure to provision eSIMs, connect users to the network, etc., we can reuse a lot of the existing architecture. The provider platform side stays untouched by the new integration.

The main parts of the technical implementation:

- **White-labeled 'Manage Plan' page:** This is the webview, from which the user can buy and manage the mobile plan. This page is branded with the partner's colors and logo. Need to set this up in a way that it's simple to scale across many partners.
- **Stripe Connect integration:** For revenue share agreements, we can use Stripe Connect. It integrates relatively easily into the existing Stripe integration. Partner will require a Stripe Connect account to receive rev share.
- **Authentication:** Current Telgea authentication model is set up to support Employee access via Company. For the whitelabel solution, we'll need a direct way for users to authenticate with Telgea infrastructure without passing through a Company's approval gate. In the PoC this is a passwordless email one-time code.
- **Partner & User DB Entities:** I assume that Brand Partners and Fans cannot directly map onto existing DB structures. Not a product decision.

## Fan Journey

### Buy Plan

1. Fan discovers partner offering (eg. via partner app, newsletter, ...)
2. Fan clicks on CTA ("Get your FC Barcelona Mobile Plan")
3. Fan lands on partner-branded web app, owned by Telgea
4. Fan enters email. If the partner requests it, membership status is verified with the partner (optional)
5. Fan confirms email via a one-time code, which creates their account
6. Fan selects country for mobile plan
7. Fan selects mobile plan
8. Fan completes payment
9. Fan follows instructions to install eSIM on device
10. Fan is connected to the network and receives a new phone number

Activation is confirmed asynchronously. The Fan can leave the page and gets notified once the line is live. If automatic confirmation does not arrive, there is an SMS fallback (the Fan texts from the new line to a Telgea number, which confirms the sender is the newly provisioned number).

### Manage plan

- 1a. Fan navigates to manage plan page through partner app
- 1b. Fan directly navigates to manage plan page through <partner>.telgea.com url
- 2. Fan authenticates via email OTP
- 3. Fan can top up data (if applicable to plan), change plan or cancel plan

## Value Proposition to Partner

- Partner builds stronger relationships with fans through daily brand interaction
- Relatively low effort new revenue stream: Telgea assumes all of the operational, compliance and support burdens
- Retention on memberships if users port their existing phone numbers to the new mobile plan

Note on the last point: I did not prioritize number porting in this PoC. My doubt was whether or not fans would put enough trust in the partner's brand as a mobile provider to move their main number to their mobile plan. Seems better to me to consider it a secondary line in the beginning.

## Edge cases & Open Questions

Some edge cases and open questions have been identified but I haven't thought fully through them, as they don't fit into the PoC scope:

- What happens if a fan cancels their membership with the partner? (In the PoC I show a 7-day grace period, after which the plan is cancelled.)
- Can we display "FC Barcelona" as the operator name on device? According to Claude, it depends on the individual carriers, since it is set at the carrier profile level rather than by Telgea.
- Do users need to choose a certain country, or do they get a global plan? Claude mentions per-country compliance considerations (eg. KYC / SIM registration), don't have enough knowledge here. In the PoC I assume the Fan selects one country.
