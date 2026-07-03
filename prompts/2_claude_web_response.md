I've got everything I need — your comments resolve all the material questions. One quick synthesis on the auth point you raised, since it ties two of your sections together:

Your instinct in the Auth section (JWT auto-creates + logs in) and your decision in the Membership section (email + partner-API + OTP) aren't in conflict — they're the same system with two entry doors. **Email + OTP is the universal primary** because it's the only thing that survives cold entry (email blasts, the partner's website), and it doubles as both auth _and_ membership-ownership proof. The **JWT deep-link becomes a fast-path** that skips straight to logged-in _when_ the user arrives from inside the already-authenticated partner app — nice to have, not load-bearing. So: PoC builds email + OTP; JWT stays documented as the reference accelerator. That's what I've written into both docs.

Writing them now.Both are ready.

**Implementation plan** — built around a single state machine so a coding agent can implement each pane deterministically. The buy journey is a state table (view / logs-on-entry / transitions), with the async install confirmation and both edge-case scenarios spelled out. The console log-style section explicitly caps the technical depth per your note, with example lines and a "don't invent telecom internals" instruction.

**Approach doc** — kept to tables and short bullets so it works as an on-screen reference while you talk. The gaps table follows _initial thought → what surfaced → decision_, which should map cleanly to how you narrate the evolution of your thinking. Your porting caveat (stickiness cuts both ways) is captured as the reasoning behind deprioritising it, which is a good beat to land verbally.

Two small things I decided rather than asked, flag if either is off:

- The manage flow re-auths via **email** OTP for consistency with the new signup, not SMS OTP as in your original notes — one auth mechanism reads cleaner in the demo.
- I included a **membership-gating toggle** and a **scenario selector** as demo controls, so the optional-verification branch and the two edge cases are all reachable on camera without code changes.

If you want, I can turn the approach doc's gaps table into a simple visual (flow of the buy journey with the console alongside) for the Loom, or tighten the implementation plan against whatever coding agent you're handing it to.
