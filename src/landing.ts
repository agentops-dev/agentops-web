const endpointList = `POST /pair/start
POST /pair/complete
POST /bridge/event
POST /bridge/approval/request
GET  /bridge/approval/:approvalId/wait
POST /mobile/approval/:approvalId/decision`;

const architectureSnapshot = `Hook Runner (VSCode) --HMAC--> Backend API --> Supabase
                         |
                         +--> Push (FCM / APNs) --> Mobile App`;

export const landingPageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentOps Backend API</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #0f172a;
        --surface: #111827;
        --surface-2: #0b1220;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --accent: #38bdf8;
        --accent-2: #22c55e;
        --border: #1f2937;
        --code: #0b1324;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: radial-gradient(circle at top, #0f172a 0%, #0b1220 60%);
        color: var(--text);
        line-height: 1.6;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .container {
        max-width: 1080px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .hero {
        padding: 72px 0 48px;
      }

      .badge {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.12);
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        font-size: clamp(32px, 4vw, 48px);
        margin: 20px 0 16px;
      }

      p.lead {
        max-width: 640px;
        font-size: 18px;
        color: var(--muted);
        margin: 0 0 24px;
      }

      .cta {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-radius: 12px;
        background: var(--accent);
        color: #07101f;
        font-weight: 600;
      }

      .cta.secondary {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text);
      }

      .cta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .grid {
        display: grid;
        gap: 20px;
      }

      .grid.three {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .grid.two {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .card {
        background: rgba(17, 24, 39, 0.6);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 18px;
      }

      .card h3 {
        margin-top: 0;
      }

      .pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(34, 197, 94, 0.15);
        color: var(--accent-2);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      section {
        padding: 36px 0;
      }

      code,
      pre {
        background: var(--code);
        color: #e2e8f0;
        border-radius: 10px;
      }

      pre {
        padding: 14px;
        overflow: auto;
        border: 1px solid var(--border);
        font-size: 13px;
      }

      footer {
        border-top: 1px solid var(--border);
        padding: 32px 0 48px;
        color: var(--muted);
      }

      .divider {
        height: 1px;
        background: var(--border);
        margin: 24px 0;
      }
    </style>
  </head>
  <body>
    <header class="hero">
      <div class="container">
        <div class="badge">AgentOps Backend API</div>
        <h1>Mobile-first agent supervision backend</h1>
        <p class="lead">
          A thin orchestrator that verifies signed events, coordinates approvals,
          and delivers mobile push notifications for long-running agent tasks.
        </p>
        <div class="cta-row">
          <a class="cta" href="/health">Check service health</a>
          <a class="cta secondary" href="https://github.com/agentops-dev" rel="noreferrer">
            AgentOps on GitHub
          </a>
        </div>
      </div>
    </header>

    <section>
      <div class="container grid three">
        <div class="card">
          <span class="pill">Secure</span>
          <h3>Signed event ingestion</h3>
          <p>
            HMAC verification with nonce replay protection ensures only trusted
            runners can publish run events and approval requests.
          </p>
        </div>
        <div class="card">
          <span class="pill">Realtime</span>
          <h3>Approval orchestration</h3>
          <p>
            Long-poll waiting channels keep agents responsive while mobile devices
            approve, deny, or annotate commands.
          </p>
        </div>
        <div class="card">
          <span class="pill">Observable</span>
          <h3>Supabase as system of record</h3>
          <p>
            Runs, events, and approvals are stored in Postgres, enabling audit
            trails and a unified timeline across devices.
          </p>
        </div>
      </div>
    </section>

    <section>
      <div class="container grid two">
        <div class="card">
          <h3>Key endpoints</h3>
          <pre>${endpointList}</pre>
        </div>
        <div class="card">
          <h3>Quick start</h3>
          <ol>
            <li>Install dependencies with <code>npm install</code>.</li>
            <li>Copy <code>.env.example</code> to <code>.env</code>.</li>
            <li>Configure Supabase, FCM, and APNs credentials.</li>
            <li>Run <code>npm run dev</code> to start the server.</li>
          </ol>
          <div class="divider"></div>
          <p>
            The API listens on <code>http://localhost:3000</code> by default.
          </p>
        </div>
      </div>
    </section>

    <section>
      <div class="container grid two">
        <div class="card">
          <h3>Architecture snapshot</h3>
          <pre>${architectureSnapshot}</pre>
        </div>
        <div class="card">
          <h3>Built for scale</h3>
          <p>
            The service is stateless by design, making it easy to scale horizontally.
            A future Redis layer will optimize approval wait channels for high
            concurrency workloads.
          </p>
          <p>
            See the README for full environment variables, schema details, and
            security guarantees.
          </p>
        </div>
      </div>
    </section>

    <footer>
      <div class="container">
        AgentOps Backend API | Thin orchestrator for mobile agent supervision
      </div>
    </footer>
  </body>
</html>
`;
