# Telgea Assignment

Help me think through an assignment for a company called Telgea.

## Context

Telgea makes international mobile connectivity work like a single network. We provide mobile plans to enterprises across many countries through one platform, backed by carriers like Telenor, Vodafone, and Swisscom.

Today the customers are enterprises. They now want to enable brands and member clubs to sell mobile plans to their own fans and users, under their own name and brand.
Example: FC Barcelona offers an "FC Barcelona" mobile plan. Registered fans discover, buy, and manage that plan directly inside the official FC Barcelona app. Telgea powers the connectivity and operations behind the scenes; the fan only ever sees the Barcelona brand.

Within our conversation, lets refer to those brands / member clubs as "partners", and to the fans / people who buy the plans as "users".

## The Challenge

Within the assignment, I need to suggest a solution for integrating this type of white-label offering into the existing architecture. The assignment asks for suggestions to the following points:

- How a partners app connects to Telgea. Which parts of our architecture they use, and what Telgea exposes to them.
- The user journey. From discovering the plan in the partners app to having a working line and managing it.
- The value it brings to the partner.

Deliverables:

- Explanation of how the solution should work an dhow it connects to the existing architecture
- Description of users's journey
- Implementaiton of simple proof of concept

Any required data can be invented.

## First thoughts

### Restrictions

- In order to minimize friction for the partners, and to make the offering more scalable, we should try to keep technical implementation effort minimal on the side of the partner.
- Partners may or may not want to verify that the people taking advantage of the offering have some kind of credentials (membership, premium subscription, etc.)

### Approach

My first instinct is that the partner needs to expose some kind of button that leads the user to a web interface owned by Telgea but branded with the partner's logo (eg. fcbarcelona.telgea.com or telgea.com/fcbarcelona). From here, the user can buy, and later manage their plan.

Rough overview of user journeys:

Buying plan:

1. User opens partner app / website and discovers mobile plan offering
2. User clicks on CTA ("Get your plan")
3. User lands on Telgea-owned web page
4. User provides proof of membership with parnter (optional)
5. User selects plan and goes through payment flow
6. User receives instructions on installing E-Sim
7. User installs E-Sim
8. User goes back to web page to confirm installation

Managing plan:
1a. User opens partner app / website and clicks on "manage mobile plan" button
1b. User goes directly to branded but Telgea-owned web page 2. User authenticates via OTP received via SMS 3. User can recharge plan credit (if applicable), view usage, change or cancel plan

By following this approach, all of the business logic stays on Telgeas side - since they already sell mobile plans to enterprises, the infrastructure for assigning numbers, providing eSims & network access, etc. already exists. The partner only needs to build the marketing page for the offering within their app, and redirect users to Telgea.

If partners wish to restrict access to the offering by membership status, they need to expose an API that Telgea can use to authenticate users. For example: User provides email address, Telgea calls partner API to verify if email corresponds to person with necessary access rights, then Telgea sends OTP to email to confirm ownership.

Partners may also want to be notified of plan purchases / changes / cancellations. Perhaps they want to update a user property in their own database, or just receive this information for reporting purposes. In any case, the partner would also need to perform some technical work on their side - most likely they need to register to webhooks that Telgea emits on the different lifecycle events.

Confirming installation of the eSim may be challenging. In my last conversation with the Telgea founder, he mentinoed this as a challenge they haven't solved yet. Apparently it takes ~15 min until they start receiving useful data from Apple/Google that can confirm if the user has successfully installed the SIM. If necessary to improve confirmation, one idea: User needs to text a certain number - if SMS comes from newly provisioned number, we know that user has installed successfully. If it comes from another number (the user's previous SIM) then send an automatic response with further instructions, or similar.

### Doubts

It's not clear to me whether these partnerships are going to be restricted to a certain geography, or not. For example - the FC Barcelona partnership: is it going to be available to fans all around the world? If this is the case, then does Telgea offer a global plan, or does the user get a plan that is bound to a selected country? If bound to country, the user journey needs an additional step in which the user selects the country. Let's assume that user needs to select country.

The assignment includes a diagram of the current architecture. There are some pieces and terms that are unfamiliar to me, especially within the parts related to the network provider:

- Tata MOVE
- MVNE #X
- REST/SOAP/SFTP Connectivity
  Also some abbreviations related to subscribers: ICCID, MSISDN

However, if my suggested approach makes sense, then the whitelabel integration doesn't need to touch these parts directly. The integration would mostly be talking to existing Telgea services (eg. eSIM provision, consumption monitoring, billing, etc.) and we wouldn't need any additional provider integrations. The only thing I can think about is that perhaps the user should see "FC Barcelona" displayed as their network provider, even though in reality, Orange is the provider acting in the background. This may need some additional work.

### What value does this bring to the partner

- Build stronger relationships with their audience: Users who are on the partner's plan will interact with the brand on a daily basis
- Direct line to the user: The partner automatically gets the user's phone number and would be able to reach them via SMS. Probably needs to be agreed on in T&C - value add depends on whether or not partner already has the phone number
- Relatively low effort additional revenue stream, assuming that there's a revenue share agreement as part of the partnership

### How to build the POC

Assignment explicitly says to use Claude Code for building the POC. I don't think we can build a "real" POC because we won't be able to provision eSIMs, etc. - so it's my understanding that the POC is more about showcasing the user journey. My first instinct is to build a web app that shows a split view between:

- Partner app
- Branded Telgea web page
- A "console" that shows mock logs of what's happening in the backend (optional but nice touch)

## What I need from you

- Review all the information and evaluate my initial thoughts on the approach. Am I thinking about it correctly on a technical and practical level? Can you identify any obvious gaps or contradictions in my thinking?
- Address the open questions and doubts - for example: does my approach to membership verification make sense? What about the eSim installation confirmation? Geo bound assumption reasonable?
- Give me your thoughts on the value proposition to the partner, am I missing something important?
- Does my approach to the PoC make sense to you or can you think of something better? Note that PoC doesnt need to be polished, I'm being evaluated more on my thinking than on technical implementation.

I'm also attaching the diagram of the architecture to this message. Analyze it and take it into consideration when evaluating my approach.
