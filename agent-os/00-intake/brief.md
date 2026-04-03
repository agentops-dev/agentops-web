# Intake Brief

**Phase:** 1 — Intake
**Project:** agent-os
**Date:** 2026-03-30
**Confidence:** Medium (founder knowledge; no customer validation yet)

---

## The Idea

**Agent OS** is a local-first platform that helps developers and engineering teams observe, organize, and control AI agents across different tools (Claude Code, Cursor, Codex, and others).

Instead of agents existing as scattered, untracked sessions, Agent OS provides a structured organizational system where agents belong to teams, inherit context, and operate within clear boundaries.

## The Problem

AI agents are:
- Fragmented across tools (Claude, Cursor, Codex, etc.)
- Hard to track and monitor
- Lacking structure and ownership
- Running without shared context
- Difficult to scale as usage grows

This leads to "agent sprawl" — confusion about what agents are doing, no clear organization, and poor coordination as agent usage scales.

## The Solution

A hierarchical organizational system for AI agents:
- Projects → Teams → Sub-teams (L1–L6 depth)
- Each folder/team contains a `CHARTER.md` defining goals, rules, and constraints
- Agents inherit context from their position in the hierarchy
- Cross-tool observability: detect and monitor agents regardless of which tool runs them
- Smart restructuring: AI-generated suggestions for reorganizing agent teams

**Positioning:** "Agent Operating System" — not just a dashboard, not just orchestration. The layer between raw agent tools and production-scale management.

## Target Customers

1. **Solo indie developers** using multiple AI coding tools simultaneously
2. **Engineering teams** at companies deploying AI agents in production
3. **Companies** scaling AI agent usage across teams

## Founder Profile

- Solo founder, side project
- Background: software development / coding
- No prior domain-specific network in AI tooling
- No co-founders
- [Assumption] Limited runway — side project implies self-funded

## Business Model

- **Open source** core (community, distribution, trust-building)
- **Paid subscription** for premium features (likely: hosted version, team features, advanced observability, enterprise controls)
- Pricing: TBD — to be informed by competitor research

## Existing Work

- Detailed README / product spec written (repo: agentops-web)
- Landing page exists (web project)
- No prototype, no customer conversations yet

## Competitive Landscape

- Founder not aware of direct competitors
- **[Flag]** This is almost certainly incorrect — the AI observability/management space is active. Research needed.

## Geography

- Global from day one

## Success Metrics

- **6-month goal:** Launch and acquire first users
- **12-month goal:** Not defined — to be developed in strategy phase

## Key Risks (Founder-Identified)

1. No team — solo execution risk
2. No network — distribution challenge
3. Platform risk — Anthropic, Microsoft, or tool vendors shipping native agent management

## Hard Questions

- **Unfair advantage:** "I know coding" — [Yellow Flag] Necessary but not differentiated. To be stress-tested in strategy.
- **Strongest argument against:** No team, no network
- **Competitive threat response:** Unclear — to be addressed in positioning strategy

---

## Flags

**Red Flags:**
- No customer conversations have happened — entire product direction is founder assumption
- "I know coding" is not a defensible moat in a developer tools market

**Yellow Flags:**
- Solo founder on a side project in a fast-moving, well-funded market
- No awareness of competitors despite an active space
- Distribution is the explicit weak point with no mitigation plan yet
- 6-month launch goal with no team may be optimistic

## Sources
- Founder intake interview (2026-03-30)
- README.md in agentops-web repository
