Good analysis on the gaps, I hadn't considered some of these points yet. Below, you'll find my comments on the different points. Since the goal of the assignment is to create a PoC, a few of these considerations fall out of that scope because I cannot visualize them in the PoC, and some of them would likely fall out of the responsibility of a Product Manager.

After reading my comments, create two documents in markdown format for me:

1. An implementation plan for the PoC which will be passed to a coding agent. The document should include enough information, so that the agent is able to implement the PoC from reading the implementation plan alone.
2. A second document which documents my approach to the assignment. It should show the initial thoughts and instructions I shared with you, gaps you identified and where you helped to clear things up, the decisions I took, and the points that we left open. I will later use this document to explain my approach to the Telgea team in a Loom. Make sure the document is not too text heavy, so that I can use it as a supporting resource on my screen recorded walkthrough - it's not a deliverable by itself.

If you need any more clarifications before you feel comfortable to write these documents, ask me before starting with writing.

## Auth

Assuming that Telgea's current architecture cannot accommodate consumer signups that are not bound to a company, we'll need a new self-signup. Considering your suggestion about the partner sending a JWT with user data, could we use this to automatically create the user + login directly? This would remove a lot of friction. Alternatively, I would suggest magic login link auth.

## Billing

Yes, Stripe Connect is that right call.

## MoC

Yes, Telgea should remain merchant of record.

## Database entities

Out of scope for assignment, but valid point that this is a technical consideration that should be discussed by the tech team.

## Membership Verification

I like your idea, but for it to work reliably, means that the user necessarily needs to be signed in within the partner's environment before landing on the Telgea-owned page. What if, for example, a partner promotes this offering in an email? In this case, the user clicks on the link, but there will be no way to receive any kind of user information from that click. My approach seems more applicable to different cases. Unless you can provide a counter argument, let's use my approach for the PoC but keep the other option for reference.

## eSIM Install Confirmation

I'm not deep enough on the topic to argue on this point, I will assume that you are correct and let's accept your suggestion for the PoC: Show activating state and confirm async. Keep less reliable SMS mechanism as fallback.

## Operator name in status bar

If this is a profile provisioning question with the operator, it seems out of the scope for the PoC. Let's keep it as an unanswered question.

## Geography

Again, I'm not informed enough on the topic to evaluate the compliance considerations and I think it's out of scope for this assignment. Let's assume that we're scoping each user's plan to one specific country that the user selects.

## Missing lifecycle edge cases

When user cancels their membership with the partner, give them 1 week grace period in which they can continue using the plan. Number porting is out of scope for PoC, in a real world setup it would become relevant. Telgea provides support, not the partner.

## Value Proposition additions

The retention on membership is the strongest point here, but I think the stickiness goes both ways. Do users trust FC Barcelona as a telecom provider enough to port their main number there? Of course, FCB isn't actually a telco provider, but not everyone may understand that. This is why I would not prioritize number porting from the start.

## PoC

Okay, we agree that the initial approach makes sense - let's keep it like this for the implementation plan. The only thing is that I would like to avoid going deeper than necessary on the technical terms in the logs. I do not want to pretend that I understand all of the intricacies of what's happening in the background.
