# Battle Card: AgentOps
*Last updated: 2026-03-30*

## At a Glance
- **What they do:** Developer platform for AI agent monitoring — tracing, session replay, time travel debugging, cost tracking across 400+ frameworks
- **Founded:** 2023 | **Funding:** $2.6M pre-seed | **Team:** ~10-15 (Estimate)
- **Price:** Free (5K events) → $40/mo Pro (unlimited events) → Custom Enterprise
- **Model:** Per event (free unlimited on Pro — flat and developer-friendly)
- **Best for:** Developers building production AI agents who need debugging and cost visibility

## Their Strengths (be honest)
- **Time travel debugging** — session replay with point-in-time precision is genuinely unique and valuable [Data]
- **Broadest framework coverage** — 400+ LLM frameworks; widest integration surface in category [Data]
- **Azure AI Foundry integration** — built-in enterprise distribution channel without enterprise sales motion [Data]
- **Google ADK integration** — also in Google's official agent ecosystem [Data]
- **2-line SDK integration** — lowest friction to instrument an agent [Data]
- **Developer-first pricing** — $40/mo flat for unlimited events is genuinely better than LangSmith's per-trace scaling

## Their Weaknesses (your openings)
- **Severely underfunded** — $2.6M pre-seed vs. LangSmith's $260M; product velocity gap is real [Data]
- **No organizational hierarchy** — monitoring tool only; no structure, no CHARTER concept
- **No context management** — doesn't help with cross-session memory or context inheritance
- **No cross-tool coding agent management** — monitors agent code but doesn't manage Claude Code + Cursor + Codex workflow
- **Small team limits roadmap execution** — 10-15 people vs. 163 at LangSmith
- **No evals depth** — evaluation capabilities limited vs. LangSmith/Langfuse [Data from comparisons]
- **No self-hosting** — closed SaaS below Enterprise

## How to Win Against Them
- **When they say "AgentOps gives us the debugging we need":** "AgentOps monitors what happened. Agent OS structures what should happen. CHARTER.md defines goals and constraints before your agents run — preventing problems rather than debugging them after."
- **When they say "AgentOps integrates with everything":** "Great — Agent OS is compatible with the same agent frameworks. The question is: are you managing your agents organizationally? Do they have defined goals, constraints, and inherited context?"
- **Lead with:** "AgentOps is a great debugging tool. Agent OS is an organization management layer. They're not the same thing — and for cross-tool coding agent management, AgentOps has nothing."

## When They Win Over You
- **Production debugging for complex multi-step agents** — time travel debugging is genuinely valuable and Agent OS doesn't have this
- **Teams heavily invested in Azure AI Foundry or Google ADK** — native integrations are harder to replace
- **Pure monitoring need** — if the team just needs "what happened in this agent run," AgentOps is simpler than Agent OS

## Their Customers' Top Complaint
Moderate overhead (12% latency impact measured) vs. near-zero for LangSmith [Data from performance comparisons]
This matters because: In production-critical systems, this overhead matters. Agent OS's local-first architecture adds no LLM call overhead.

## Key Vulnerability
AgentOps raised $2.6M in 2024 and has not announced a follow-on round. If they don't raise a Series A soon, execution will stall. Developer tools require continued investment to keep up with fast-moving competitors. This creates an opportunity to win AgentOps customers who are concerned about the platform's long-term sustainability.

## Churn Signals
Why their customers may leave:
- Funding uncertainty — developers won't commit deeply to a tool without confidence in company survival
- Lack of evaluation depth drives teams to LangSmith or Langfuse for production
- Teams wanting organizational structure beyond monitoring

## Watch For
AgentOps Series A fundraise — if they raise, execution accelerates. If they don't in 2026, consider them a declining competitor. Azure AI Foundry could also acquire them — Microsoft has pattern of acquiring small developer tools with native integrations.
