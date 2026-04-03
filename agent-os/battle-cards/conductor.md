# Battle Card: Conductor
*Last updated: 2026-03-30*

## At a Glance
- **What they do:** macOS app for running multiple AI coding agents (Claude Code, Codex) in parallel across isolated git worktrees with a visual dashboard
- **Founded:** 2024 | **Funding:** YC S24 (~$500K assumed) | **Team:** 4
- **Price:** Free (you pay your own API costs)
- **Model:** Free product; no current monetization
- **Best for:** Senior developers/tech leads on macOS who want to run multiple Claude Code instances simultaneously

## Their Strengths (be honest)
- Best UX in the multi-agent coding tools category — consistently praised by developers [Data from multiple reviews]
- YC-backed credibility + founder (Charlie Holtz) has strong developer following from Replicate background [Data]
- Weekly releases (v0.44 as of March 2026) show serious development velocity [Data from changelog]
- Git worktree isolation is genuinely clean — each agent in its own branch, no conflicts [Data]
- Vision statement ("human interface to AI organizations") resonates with the market [Data from conductor.build]
- Early adopters at Stripe, Notion, Vercel [Data]
- "I've been using Conductor every day...the future. The last time I felt this strongly about a developer tool was Vercel and Supabase." — developer quote [Data verbatim]

## Their Weaknesses (your openings)
- **macOS only** — Linux and Windows developers completely excluded [Data from product page]
- **No organizational hierarchy** — parallel execution only; no Projects → Teams → Sub-teams concept
- **No context inheritance** — .context folder is a start but flat, not hierarchical [Data from changelog]
- **No CHARTER concept** — no way to define goals, constraints, or rules per team
- **No cross-tool management** — focused on Claude Code + Codex; no Cursor management, no unified cross-tool view
- **No observability** — can see agents running but no cost tracking, performance monitoring, or trace analysis
- **Free product = uncertain future** — no revenue means monetization pivot coming; when pricing changes, developer relationships may shift
- **4-person team** — very limited bandwidth despite good velocity

## How to Win Against Them
- **When they say "I already use Conductor":** "Conductor runs your agents in parallel. Agent OS organizes what your agents are doing, why, and how they relate to each other. Use Conductor for the execution — Agent OS gives your agents structure, goals, and inherited context."
- **When they say "Conductor is free":** "So is Agent OS core. The difference is Agent OS gives you organizational structure that Conductor doesn't have — CHARTERs, context inheritance, cross-tool management. When Conductor eventually charges for premium features, Agent OS will still be open source."
- **When they say "Conductor has a great UX":** Acknowledge it honestly: "Conductor's UI is great for parallel execution. Agent OS's value is the organizational layer — the CHARTER hierarchy, context inheritance, and cross-tool awareness that makes your agents work as a coordinated team, not just parallel workers."
- **Lead with:** "Conductor runs agents. Agent OS manages agent organizations. They're complementary — use both."

## When They Win Over You
Be honest about when Conductor is the better choice:
- **macOS developers wanting the simplest parallel execution tool** — Conductor's UI is genuinely superior for this specific use case
- **Teams that just want to run Claude Code instances faster** — if the need is purely parallel execution without organizational structure, Conductor is simpler
- **Developers who are visual and want a native macOS app** — Agent OS's CLI-first approach won't satisfy this preference

## Their Customers' Top Complaint
"Only works on macOS" — consistent point in every overview and review [Data]
This matters because: A significant portion of developers use Linux (especially backend engineers). Agent OS's cross-platform availability is a direct differentiator.

## Key Vulnerability
Conductor has no revenue and needs to monetize. When they add paid features, expect developer friction and community complaints. Agent OS's open-source core is a structural advantage in that moment — developers who feel burned by Conductor's monetization pivot have a natural home.

## Churn Signals
Why their customers may leave:
- Linux/Windows developers who never could use it — significant excluded population
- Teams wanting context management / organizational hierarchy — as they realize Conductor doesn't solve this
- When Conductor monetizes — price sensitivity in developer tools is real

## Watch For
Conductor's .context folder (added Dec 2025) is moving toward context management. Their vision statement explicitly mentions "AI organizations." They are on Agent OS's path. Watch their changelog monthly — if they add hierarchical context inheritance or CHARTER-like features, the competitive dynamics shift significantly. Likely timeline: 6-12 months based on development velocity.
