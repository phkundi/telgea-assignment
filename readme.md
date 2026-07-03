# Telgea Assignment - Repo Info

This repository includes all the deliverables and supporting materials.

## Contents

- [/app](/app) includes the PoC code - React app created with Claude Code (Opus 4.8)
- The prompts I used are stored in [/prompts](/prompts). Note that I started off in Claude Web, where I presented the assignment and my initial thought process to Claude, with the goal of developing an implementation plan for Claude Code. I also included the responses of the Claude Web agent there. Prompts are sorted chronologically (1-9).
- In one of the prompts, I asked Claude to summarize my approach into a file, so that it's easier to trace, which parts of the solution are coming form myself, and where Claude stepped in: [approach-and-decisions.md](/approach-and-decisions.md)
- [This implementation plan](/poc-implementation-plan.md) was output of my web session. As you can see from the prompts, I gave very little additional instrucitons within the Claude Code session.

## Chosen approach

Brand-Partner redirects user from their app / website to a branded website owned by Telgea (eg. fcbarcelona.telgea.com). From there, users can purchase and manage their mobile plans. I selected this approach because I optimized for minimum technical effort on the partners side. With my solution, Telgea owns almost all of the technical platform, and the partner only needs to perform minimal technical implementation effort.

The alternative would have been to have the integration living inside of the partner's app. This way, the user never leaves the partner's universe. There are some benefits to this, such as simpler membership verification. However, this approach requires the partner to do much more implementation effort, and requires Telgea to maintain SDKs including documentation and support across platforms.

## Technical integration

Since Telgea already has all of the technical infrastructure to provision eSIMs, connect user to network, etc., we can reuse a lot of the existing architecture. The provider platform side stays untouched by the new integration.

The main parts of the technical implementation:

- **White-labeled 'Manage Plan' page:** This is the webview, from which the user can buy and manage the mobile plan. This page is branded with the partner's colors and logo. Need to set this up in a way that it's simple to scale across many partners.
- **Stripe Connect integration:** For revenue share agreements, we can use Stripe Connect - it integrates relatively easily into the existing Stripe integration. Partner will require a Stripe Connect account to receive rev share.
- **Authentication:** Current Telgea authentication model is set up to support Employee access via Company. For the whitelabel solution, we'll need a direct way for users to authenticate with Telgea infrastructure without passing through a Company's approval gate.
- **Partner & User DB Entities:** I assume that Brand Partners and Fans cannot directly map onto existing DB structures. Not a product decision.

## Fan Journey

### Buy Plan

1. Fan discovers partner offering (eg. via partner app, newsletter, ...)
2. Fan clicks on CTA ("Get your FC Barcelona Mobile Plan")
3. Fan lands on partner-branded web app, owned by Telgea
4. Fan verifies membership status with partner (optional, if requested by partner)
5. Fan selects country for mobile plan
6. Fan selects mobile plan
7. Fan completes payment
8. Fan follows instructions to install eSIM on device
9. Fan is connected to network receives new phone number

### Manage plan

1a. Fan navigates to manage plan page through partner app
1b. Fan directly navigates to manage plan page through <partner>.telgea.com url 2. Fan authenticates via email OTP 3. Fan can top up data (if applicable to plan), change plan or cancel plan

## Value Proposition to Partner

- Partner builds stronger relationships with fans through daily brand interaction
- Relatively low effort new revenue stream: Telgea assumes all of the operational, compliance and support burdens
- Retention on memberships if users port their existing phone numbers to the new mobile plan

Note on the last point: I did not prioritize number porting in this PoC. My doubt was whether or not fans would put enough trust the partner's brand as a mobile provider to move their main number to their mobile plan. Seems better to me consider it a secondary line in the beginning.

## Edge cases & Open Questions

Some edge cases and open questions have been identified but I haven't thought fully through them as they don't fit into the PoC scope:

- What happens if a fan cancels their membership with the partner?
- Can we display "FC Barcelona" as the operator name on device? According to Claude, it depends on the individual carriers.
- Do users need to choose a certain country, or do they get a global plan? Claude mentions compliance considerations, don't have enough knowledge here.
