const endpointList = `POST /pair/start
POST /pair/complete
POST /bridge/event
POST /bridge/approval/request
GET  /bridge/approval/:approvalId/wait
POST /mobile/approval/:approvalId/decision`;

const architectureSnapshot = `Cursor Local Agent
  ↓ Hooks (Cursor)
Local Hook Runner
  ↓ HTTPS (HMAC)
Backend API (orchestrator)
  ↓ SQL (service role)
Supabase Postgres
  ↑ Realtime (optional)
Flutter Mobile App
  ↓ Push
FCM / APNs`;

const mustHaveList = `
<li>Mobile push when the local agent finishes, fails, or stops.</li>
<li>Mobile approval before terminal commands execute.</li>
<li>Mid-run instructions attached to approvals (v1 path).</li>
<li>Audit log with run timeline ordered by time.</li>
`;

const nonGoalsList = `
<li>No streaming full agent text or token output to the phone.</li>
<li>No reading chain-of-thought or internal reasoning.</li>
<li>No direct control of Cursor internal chat.</li>
`;

const componentList = `
<li><strong>Cursor Extension</strong> installs hooks and stores secrets.</li>
<li><strong>Local Hook Runner</strong> signs events and blocks on approvals.</li>
<li><strong>Backend API</strong> verifies signatures and orchestrates waits.</li>
<li><strong>Supabase</strong> is the system of record (runs, events, approvals).</li>
<li><strong>Flutter App</strong> shows timelines and approval inbox.</li>
<li><strong>Push Layer</strong> uses FCM/APNs for notifications.</li>
`;

const supabaseUseList = `
<li>Runs, events, approvals, devices, workspaces.</li>
<li>Auth and RLS (recommended for v2).</li>
<li>Optional realtime subscriptions for inbox updates.</li>
`;

const supabaseAvoidList = `
<li>Blocking or wait semantics (use backend + waiters).</li>
<li>Push notifications (use backend).</li>
`;

const runStatusList = `
<li>RUNNING</li>
<li>WAITING_APPROVAL</li>
<li>WAITING_INPUT (future)</li>
<li>COMPLETED</li>
<li>FAILED</li>
<li>STOPPED</li>
<li>STALLED (watchdog)</li>
`;

const eventTypeList = `
<li>RUN_STARTED</li>
<li>RUN_FINISHED</li>
<li>RUN_FAILED</li>
<li>RUN_STOPPED</li>
<li>TOOL_REQUESTED</li>
<li>TOOL_FINISHED</li>
<li>MESSAGE (optional)</li>
<li>HEARTBEAT (optional)</li>
<li>FILE_CHANGED (future)</li>
`;

const providerList = `
<li>cursor_local (v1)</li>
<li>cursor_cloud (future)</li>
<li>github (future)</li>
<li>claude_code_local (future)</li>
<li>copilot_agent (future)</li>
`;

const schemaList = `
<li>devices</li>
<li>workspaces</li>
<li>runs</li>
<li>events</li>
<li>approvals</li>
`;

const milestoneList = `
<li><strong>Milestone 1:</strong> Approval MVP (pairing + shell approvals).</li>
<li><strong>Milestone 2:</strong> Runs timeline (runs/events tables + UI).</li>
<li><strong>Milestone 3:</strong> Failure detection (afterShellExecution).</li>
<li><strong>Milestone 4:</strong> Mid-run instruction attached to approvals.</li>
<li><strong>Milestone 5:</strong> Hardening (replay protection, buffering).</li>
`;

const riskList = `
<li>Hook coverage differences across Cursor versions → tolerant runner.</li>
<li>Approval waits can deadlock runs → hard timeout + safe deny.</li>
<li>Data leakage risk → redact payloads by default.</li>
`;

const securityList = `
<li>HMAC-SHA256 signatures with timestamp + nonce.</li>
<li>Replay protection and rate limiting in the backend.</li>
<li>90s default approval timeout with desktop fallback.</li>
<li>Backend uses Supabase service role for writes.</li>
`;

export const landingPageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentOps | Agent Supervisor Platform</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0b0f1a;
        --surface: rgba(15, 23, 42, 0.86);
        --surface-strong: #0f172a;
        --text: #f8fafc;
        --muted: #9ca3af;
        --accent: #7c3aed;
        --accent-2: #22d3ee;
        --accent-3: #22c55e;
        --border: rgba(148, 163, 184, 0.2);
        --code: #0b1324;
        --shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background:
          radial-gradient(900px circle at 20% -10%, rgba(124, 58, 237, 0.2), transparent 55%),
          radial-gradient(720px circle at 90% 0%, rgba(34, 211, 238, 0.2), transparent 55%),
          var(--bg);
        color: var(--text);
        line-height: 1.6;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .container {
        max-width: 1120px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .top {
        padding: 24px 0 0;
      }

      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .logo {
        font-weight: 700;
        letter-spacing: 0.02em;
        font-size: 18px;
      }

      .nav-links {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        font-size: 14px;
        color: var(--muted);
      }

      .nav-links a:hover {
        color: var(--text);
      }

      .hero {
        padding: 64px 0 36px;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 32px;
        align-items: center;
      }

      .badge {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(124, 58, 237, 0.18);
        color: #d8b4fe;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        font-size: clamp(34px, 4vw, 52px);
        margin: 20px 0 16px;
      }

      p.lead {
        max-width: 640px;
        font-size: 18px;
        color: var(--muted);
        margin: 0 0 24px;
      }

      .cta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .cta {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-radius: 12px;
        background: linear-gradient(120deg, var(--accent), #5b21b6);
        color: #f8fafc;
        font-weight: 600;
        box-shadow: var(--shadow);
      }

      .cta.secondary {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text);
        box-shadow: none;
      }

      .grid {
        display: grid;
        gap: 20px;
      }

      .grid.three {
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      }

      .grid.two {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 20px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
      }

      .card.highlight {
        border: 1px solid rgba(124, 58, 237, 0.4);
        background: linear-gradient(140deg, rgba(124, 58, 237, 0.2), rgba(15, 23, 42, 0.9));
      }

      .card h3 {
        margin-top: 0;
      }

      .stack {
        display: grid;
        gap: 16px;
      }

      .pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(34, 197, 94, 0.15);
        color: var(--accent-3);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      section {
        padding: 36px 0;
      }

      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .section-title h2 {
        margin: 0;
        font-size: 26px;
      }

      .section-title span {
        color: var(--muted);
        font-size: 14px;
      }

      .list {
        margin: 0;
        padding-left: 18px;
        color: var(--muted);
      }

      .list li {
        margin: 8px 0;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 14px;
        margin-top: 28px;
      }

      .stat {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 14px 16px;
      }

      .stat strong {
        display: block;
        font-size: 20px;
        margin-bottom: 4px;
      }

      .stat span {
        color: var(--muted);
        font-size: 13px;
      }

      code,
      pre {
        background: var(--code);
        color: #e2e8f0;
        border-radius: 12px;
      }

      pre {
        padding: 14px;
        overflow: auto;
        border: 1px solid var(--border);
        font-size: 13px;
      }

      .divider {
        height: 1px;
        background: var(--border);
        margin: 24px 0;
      }

      .note {
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(34, 211, 238, 0.08);
        border: 1px solid rgba(34, 211, 238, 0.3);
        color: #bae6fd;
        font-size: 14px;
      }

      footer {
        border-top: 1px solid var(--border);
        padding: 32px 0 48px;
        color: var(--muted);
      }

      @media (max-width: 720px) {
        .nav {
          flex-direction: column;
          align-items: flex-start;
        }

        .section-title {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <header class="top">
      <div class="container nav">
        <div class="logo">AgentOps</div>
        <nav class="nav-links">
          <a href="#overview">Overview</a>
          <a href="#flow">Flow</a>
          <a href="#components">Components</a>
          <a href="#data">Data model</a>
          <a href="#api">API</a>
          <a href="#milestones">Milestones</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero" id="overview">
        <div class="container hero-grid">
          <div>
            <div class="badge">Agent Supervisor Platform</div>
            <h1>Mobile control plane for Cursor Local Agent</h1>
            <p class="lead">
              AgentOps is a Supabase-first platform that supervises local agent
              runs with approvals, push notifications, and audit trails. It is
              built to scale into multi-agent providers while shipping a focused
              v1 for Cursor Hooks.
            </p>
            <div class="cta-row">
              <a class="cta" href="/health">Check service health</a>
              <a class="cta secondary" href="https://github.com/agentops-dev" rel="noreferrer">
                AgentOps on GitHub
              </a>
            </div>
            <div class="stats">
              <div class="stat">
                <strong>90s</strong>
                <span>Default approval timeout</span>
              </div>
              <div class="stat">
                <strong>6</strong>
                <span>Core components in v1</span>
              </div>
              <div class="stat">
                <strong>Supabase</strong>
                <span>System of record</span>
              </div>
            </div>
          </div>
          <div class="stack">
            <div class="card highlight">
              <span class="pill">Must-have v1</span>
              <h3>What ships first</h3>
              <ul class="list">${mustHaveList}</ul>
            </div>
            <div class="card">
              <span class="pill">Non-goals v1</span>
              <h3>What we do not ship</h3>
              <ul class="list">${nonGoalsList}</ul>
            </div>
          </div>
        </div>
      </section>

      <section id="flow">
        <div class="container">
          <div class="section-title">
            <h2>Architecture and data flow</h2>
            <span>Supabase-first, backend as thin orchestrator</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>System flow</h3>
              <pre>${architectureSnapshot}</pre>
              <div class="divider"></div>
              <div class="note">
                Supabase is the system of record. The backend verifies signatures,
                waits for approvals, and delivers push notifications.
              </div>
            </div>
            <div class="card">
              <h3>Supabase responsibilities</h3>
              <ul class="list">${supabaseUseList}</ul>
              <div class="divider"></div>
              <h3>Do not use Supabase for</h3>
              <ul class="list">${supabaseAvoidList}</ul>
            </div>
          </div>
        </div>
      </section>

      <section id="components">
        <div class="container">
          <div class="section-title">
            <h2>Core components</h2>
            <span>Cross-platform stack from editor to mobile</span>
          </div>
          <div class="card">
            <ol class="list">${componentList}</ol>
          </div>
        </div>
      </section>

      <section id="data">
        <div class="container">
          <div class="section-title">
            <h2>Normalized domain model</h2>
            <span>Multi-provider ready, Cursor Local first</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>Run statuses</h3>
              <ul class="list">${runStatusList}</ul>
            </div>
            <div class="card">
              <h3>Event types</h3>
              <ul class="list">${eventTypeList}</ul>
            </div>
          </div>
          <div class="grid two" style="margin-top: 20px;">
            <div class="card">
              <h3>Supabase tables</h3>
              <ul class="list">${schemaList}</ul>
            </div>
            <div class="card">
              <h3>Provider abstraction</h3>
              <ul class="list">${providerList}</ul>
            </div>
          </div>
        </div>
      </section>

      <section id="api">
        <div class="container">
          <div class="section-title">
            <h2>Approval and events API</h2>
            <span>Blocking approvals with reliable long-polling</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>Key endpoints</h3>
              <pre>${endpointList}</pre>
              <div class="divider"></div>
              <h3>Approval flow</h3>
              <ol class="list">
                <li>Hook runner sends signed approval request.</li>
                <li>Backend writes approval and sets run status.</li>
                <li>Mobile approves or denies with optional note.</li>
                <li>Hook runner unblocks with the decision.</li>
              </ol>
            </div>
            <div class="card">
              <h3>Security and reliability</h3>
              <ul class="list">${securityList}</ul>
              <div class="divider"></div>
              <h3>Mobile actions</h3>
              <ul class="list">
                <li>Approve or deny command requests.</li>
                <li>Attach instruction notes to approvals.</li>
                <li>Review the audit timeline for each run.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="milestones">
        <div class="container">
          <div class="section-title">
            <h2>Implementation milestones</h2>
            <span>Plan of record for v1 to v2</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>Release plan</h3>
              <ol class="list">${milestoneList}</ol>
            </div>
            <div class="card">
              <h3>Risks and mitigations</h3>
              <ul class="list">${riskList}</ul>
              <div class="divider"></div>
              <h3>Quick start</h3>
              <ol class="list">
                <li>Install dependencies with <code>npm install</code>.</li>
                <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
                <li>Configure Supabase, FCM, and APNs credentials.</li>
                <li>Run <code>npm run dev</code> to start the server.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container">
        AgentOps | Supabase-first agent supervision platform for Cursor Local Agent
      </div>
    </footer>
  </body>
</html>
`;
