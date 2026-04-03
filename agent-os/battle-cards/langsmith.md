# Battle Card: LangSmith
*Last updated: 2026-03-30*

## At a Glance
- **What they do:** Full-lifecycle AI agent engineering platform — tracing, evaluation, monitoring, and deployment for LLM applications
- **Founded:** 2023 (product) | **Funding:** $260M total, Series B unicorn ($1.25B) | **Team:** ~163
- **Price:** Free → $39/seat/mo Plus → Custom Enterprise
- **Model:** Per trace + per seat (aggressive at scale)
- **Best for:** Engineering teams building production agents on LangChain/LangGraph; Fortune 500 enterprises

## Their Strengths (be honest)
- Category leader — 35% of Fortune 500 use LangChain; Klarna, LinkedIn, Uber, Rippling, Cloudflare are customers [Data]
- Best-in-class tracing with zero measurable latency overhead [Data from comparisons]
- Most comprehensive evaluation tooling (LLM-as-judge, human annotation, A/B experiments, dataset management)
- $125M Series B (Oct 2025) funds years of product development and enterprise sales
- Built-in distribution via LangChain's 90M monthly downloads and 100K+ GitHub stars [Data]

## Their Weaknesses (your openings)
- **Cost at scale is punishing:** 5M traces/month = ~$12K/month in overages alone [Data]. Developers routinely complain about surprise bills.
- **LangChain lock-in:** "Felt too tied into the LangChain ecosystem" — A5Labs migration story [Data verbatim]. Switch frameworks, lose most of the value.
- **UI complexity:** "Cluttered" at scale; "tricky with larger datasets" [Data from reviews]
- **Closed source:** Self-hosting requires expensive Enterprise deal; data sovereignty concerns
- **Zero coding agent management:** No way to manage Claude Code sessions, Cursor agents, or Codex contexts. Completely absent.
- **No organizational hierarchy:** No Projects → Teams concept; no CHARTER/context inheritance; no cross-tool awareness

## How to Win Against Them
- **When they say "We already use LangSmith":** "LangSmith observes your agents. Agent OS organizes them. CHARTER.md gives every agent team goals and constraints that persist across tools and sessions — something LangSmith can't do."
- **When they say "LangSmith does everything we need":** "Does LangSmith let you manage your Claude Code sessions alongside your Cursor agents? Can it define what each agent team should do and shouldn't do? Can it pass context from your product team agents down to your engineering sub-team agents automatically?"
- **When they say "LangSmith pricing is fine":** Present the math: "At 500K traces/month with 10 people, you're paying ~$1,700/month. Agent OS is [price] flat. No surprise overage."
- **Lead with:** "LangSmith is an observability tool. Agent OS is an organizational layer. You probably want both — but start with structure before you add monitoring."

## When They Win Over You
Be honest about when LangSmith is the better choice:
- **Production monitoring for LangChain-native apps** — if the team builds entirely on LangChain/LangGraph, LangSmith's native integration is unbeatable
- **Advanced evaluations** — LLM-as-judge, human annotation queues, regression test datasets — LangSmith is the most mature here
- **Enterprise compliance requirements** — BYOC, SOC 2, HIPAA, audit logs — LangSmith has this; Agent OS doesn't yet
- **Very large teams** — 50+ engineers with established LangChain stack; switching costs are real

## Their Customers' Top Complaint
"Per-trace pricing and limited retention triggering huge bills as usage scales" — developer community consensus [Data]
This matters because: Any team evaluating Agent OS that has been burned by LangSmith's pricing is primed to consider an alternative with transparent, flat pricing.

## Key Vulnerability
LangSmith has no coding agent management for the developer workflow (Claude Code + Cursor + Codex). Their entire product assumes you're building an AI application, not managing AI coding assistants. This is Agent OS's primary opening.

## Churn Signals
Why their customers leave:
- Pricing surprise at scale — frequency: Very common; teams hit unexpected bills at production volumes
- Framework migration (off LangChain) — frequency: Common; LangSmith value drops significantly
- Data sovereignty concerns (closed-source) — frequency: Moderate; regulated industries or privacy-sensitive teams

## Watch For
LangSmith's "platform for agent engineering" framing signals expansive roadmap ambitions. With $125M in the bank and 163 engineers, they could build into adjacent areas. Monitor their changelog quarterly. If they ship "multi-tool coding agent management," accelerate Agent OS launch timeline.
