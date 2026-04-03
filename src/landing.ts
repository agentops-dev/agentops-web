const challengeList = `
<li>AI work is fragmented across tools, tabs, and personal workflows.</li>
<li>Leaders cannot see ownership, status, or risk in real time.</li>
<li>Teams repeat context and policies because rules are not centralized.</li>
<li>Scaling usage increases chaos faster than quality.</li>
`;

const coreIdeasList = `
<li>Organize agents by business context: <strong>Project → Teams → Sub-teams (L1-L6)</strong>.</li>
<li>Every team owns a <code>CHARTER.md</code> with mission, rules, and constraints.</li>
<li>Agents inherit context from where they live in the hierarchy.</li>
<li>Structure health checks recommend split, merge, and rebalance actions before drift grows.</li>
`;

const featureCards = `
<article class="feature-card">
  <h3>Agent Observability</h3>
  <p>Track running, idle, and failed agents with logs and task visibility in one dashboard.</p>
</article>
<article class="feature-card">
  <h3>Context Inheritance</h3>
  <p>Combine project rules, parent charters, team constraints, and agent instructions.</p>
</article>
<article class="feature-card">
  <h3>Management Controls</h3>
  <p>Assign, move, start, stop, and monitor agents while exposing effective rules clearly.</p>
</article>
<article class="feature-card">
  <h3>Smart Restructuring</h3>
  <p>Preview AI restructuring plans with context diffs before safe one-click migration.</p>
</article>
`;

const architectureList = `
<li><strong>Local Agent Supervisor</strong> detects, normalizes, and streams runtime state.</li>
<li><strong>Adapters</strong> bridge tool ecosystems (Claude, Codex, Cursor, and future MCP frameworks).</li>
<li><strong>Backend Core</strong> stores org structure, computes inheritance, and enforces boundaries.</li>
<li><strong>Desktop/Web UI</strong> gives operators one control plane for visibility and governance.</li>
`;

const mvpList = `
<li>Model your org with depth guardrails (L1-L6).</li>
<li>Connect Claude and Codex agents into one live view.</li>
<li>Track status, logs, and ownership from a single dashboard.</li>
<li>Define team charters and verify effective inherited context.</li>
<li>Move agents across teams without losing governance.</li>
`;

const futureList = `
<li><strong>Phase 2:</strong> AI restructuring recommendations and performance insights.</li>
<li><strong>Phase 3:</strong> Routing and collaboration across orchestrated agent teams.</li>
<li><strong>Phase 4:</strong> Plugin ecosystem and standard OS layer for agent operations.</li>
`;

const useCaseList = `
<li><strong>Engineering leaders:</strong> identify bottlenecks and rebalance ownership.</li>
<li><strong>Platform teams:</strong> enforce policies across every agent environment.</li>
<li><strong>Product operators:</strong> coordinate multi-tool delivery without session sprawl.</li>
`;

const principlesList = `
<li>Structure over chaos.</li>
<li>Clarity over flexibility.</li>
<li>User control over automation.</li>
<li>Local-first and privacy-friendly defaults.</li>
<li>Agents belong to teams, not sessions.</li>
`;

const quickstartSteps = `
<li>Open source and self-hosted. Run everything in your own environment.</li>
<li>Interactive local setup from source with no hosted account requirement.</li>
<li>Start the backend and connect your first agent workspace in minutes.</li>
`;

const quickstartCommand = `npm install
npm run onboard -- --yes
npm run dev`;

export const landingPageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentOps | Control Plane for AI Agents</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;500;700&display=swap");

      :root {
        color-scheme: dark;
        --bg: #090908;
        --bg-2: #161513;
        --surface: rgba(22, 21, 19, 0.78);
        --surface-strong: #1f1d1a;
        --text: #f6f1e9;
        --muted: #c4b8a1;
        --accent: #ec6f2f;
        --accent-2: #f7be38;
        --accent-3: #7fcab0;
        --border: rgba(246, 241, 233, 0.18);
        --shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "IBM Plex Sans", sans-serif;
        background:
          linear-gradient(160deg, rgba(236, 111, 47, 0.14), transparent 36%),
          linear-gradient(340deg, rgba(127, 202, 176, 0.1), transparent 40%),
          repeating-linear-gradient(
            -50deg,
            rgba(247, 190, 56, 0.05) 0,
            rgba(247, 190, 56, 0.05) 1px,
            transparent 1px,
            transparent 14px
          ),
          var(--bg);
        color: var(--text);
        line-height: 1.6;
        min-height: 100vh;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .container {
        max-width: 1180px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .top {
        padding: 20px 0 0;
      }

      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .logo {
        font-family: "Bebas Neue", sans-serif;
        font-size: 34px;
        letter-spacing: 0.06em;
      }

      .nav-links {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: var(--muted);
      }

      .nav-links a:hover {
        color: var(--accent-2);
      }

      .hero {
        padding: 48px 0 30px;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 34px;
        align-items: center;
      }

      .badge {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        padding: 7px 13px;
        border-radius: 999px;
        background: rgba(236, 111, 47, 0.14);
        color: #ffd0b7;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        border: 1px solid rgba(236, 111, 47, 0.45);
      }

      h1 {
        font-family: "Bebas Neue", sans-serif;
        font-size: clamp(54px, 8vw, 108px);
        line-height: 0.94;
        margin: 18px 0 12px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }

      p.lead {
        max-width: 720px;
        font-size: 19px;
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
        padding: 12px 20px;
        border-radius: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 12px;
        font-weight: 700;
        background: linear-gradient(130deg, var(--accent), #cc4f0f);
        color: #f8fafc;
        box-shadow: var(--shadow);
        border: 1px solid rgba(246, 241, 233, 0.1);
      }

      .cta.secondary {
        background: rgba(31, 29, 26, 0.7);
        border: 1px solid var(--border);
        color: var(--text);
        box-shadow: none;
      }

      .quote {
        margin-top: 20px;
        padding-left: 18px;
        border-left: 2px solid var(--accent-2);
        font-family: "Instrument Serif", serif;
        font-size: 26px;
        line-height: 1.24;
        color: #f6d9ab;
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
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 22px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(8px);
      }

      .card.highlight {
        border: 1px solid rgba(236, 111, 47, 0.45);
        background: linear-gradient(140deg, rgba(236, 111, 47, 0.12), rgba(31, 29, 26, 0.9));
      }

      .card h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 20px;
      }

      .stack {
        display: grid;
        gap: 16px;
      }

      .pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(127, 202, 176, 0.14);
        color: #b7f7df;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        border: 1px solid rgba(127, 202, 176, 0.4);
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
        font-family: "Bebas Neue", sans-serif;
        font-size: 40px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .section-title span {
        color: var(--muted);
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .list {
        margin: 0;
        padding-left: 18px;
        color: var(--muted);
      }

      .list li {
        margin: 8px 0;
      }

      .feature-card {
        background: rgba(31, 29, 26, 0.86);
        border: 1px solid var(--border);
        border-left: 4px solid var(--accent);
        border-radius: 10px;
        padding: 18px;
      }

      .feature-card p {
        color: var(--muted);
        margin-bottom: 0;
      }

      .matrix {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }

      .matrix th,
      .matrix td {
        border: 1px solid var(--border);
        padding: 10px 12px;
        text-align: left;
      }

      .matrix th {
        background: rgba(236, 111, 47, 0.12);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-size: 11px;
      }

      .matrix td:nth-child(2),
      .matrix td:nth-child(3) {
        text-align: center;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 14px;
        margin-top: 28px;
      }

      .stat {
        background: rgba(31, 29, 26, 0.88);
        border: 1px solid var(--border);
        border-radius: 10px;
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

      .divider {
        height: 1px;
        background: var(--border);
        margin: 24px 0;
      }

      .note {
        padding: 12px 14px;
        border-radius: 10px;
        background: rgba(247, 190, 56, 0.08);
        border: 1px solid rgba(247, 190, 56, 0.28);
        color: #f8de9d;
        font-size: 14px;
      }

      .quickstart-command {
        margin: 0;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: #100f0d;
        color: #f9e6c1;
        font-family: "SFMono-Regular", Menlo, Consolas, monospace;
        font-size: 13px;
        white-space: pre-wrap;
      }

      footer {
        border-top: 1px solid var(--border);
        padding: 32px 0 48px;
        color: var(--muted);
      }

      .footer-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .conversion {
        background: linear-gradient(145deg, rgba(236, 111, 47, 0.12), rgba(127, 202, 176, 0.08));
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 24px;
      }

      .conversion h3 {
        margin-top: 0;
        font-size: 28px;
        font-family: "Bebas Neue", sans-serif;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .mini-proof {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
      }

      .mini-proof span {
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 5px 10px;
        font-size: 12px;
        color: var(--muted);
      }

      code {
        font-family: "IBM Plex Sans", sans-serif;
        background: rgba(127, 202, 176, 0.14);
        border: 1px solid rgba(127, 202, 176, 0.3);
        border-radius: 8px;
        padding: 1px 8px;
        color: #d8faed;
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

        .hero-grid {
          grid-template-columns: 1fr;
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
          <a href="#problem">Problem</a>
          <a href="#components">Components</a>
          <a href="#features">Features</a>
          <a href="#mvp">MVP</a>
          <a href="#quickstart">Quickstart</a>
          <a href="#vision">Vision</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero" id="overview">
        <div class="container hero-grid">
          <div>
            <div class="badge">For teams running AI agents</div>
            <h1>Control every agent across every tool</h1>
            <p class="lead">
              AgentOps gives engineering and product teams one customer-facing
              control plane to observe, organize, and govern AI agents across
              Claude, Cursor, Codex, and more.
            </p>
            <div class="cta-row">
              <a class="cta" href="mailto:founders@agentops.dev?subject=AgentOps%20Demo%20Request">Request demo</a>
              <a class="cta secondary" href="/app">
                Open local app
              </a>
            </div>
            <div class="mini-proof">
              <span>Cross-tool visibility</span>
              <span>Team ownership model</span>
              <span>Context inheritance engine</span>
            </div>
            <div class="quote">
              "When agent usage scales, structure is the product feature that
              keeps teams fast, compliant, and in control."
            </div>
            <div class="stats">
              <div class="stat">
                <strong>L1-L6</strong>
                <span>Structured hierarchy depth</span>
              </div>
              <div class="stat">
                <strong>Cross-tool</strong>
                <span>Claude, Cursor, Codex visibility</span>
              </div>
              <div class="stat">
                <strong>Local-first</strong>
                <span>Privacy-friendly by design</span>
              </div>
            </div>
          </div>
          <div class="stack">
            <div class="card highlight">
              <span class="pill">The problem</span>
              <h3>Agent sprawl kills leverage</h3>
              <ul class="list">${challengeList}</ul>
            </div>
            <div class="card">
              <span class="pill">The shift</span>
              <h3>From sessions to structure</h3>
              <ul class="list">${coreIdeasList}</ul>
            </div>
          </div>
        </div>
      </section>

      <section id="problem">
        <div class="container">
          <div class="section-title">
            <h2>Positioning</h2>
            <span>Built for customer teams managing production agent workflows.</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>What AgentOps is not</h3>
              <ul class="list">
                <li>Just a monitoring page for disconnected sessions.</li>
                <li>An autonomous "run-your-company" orchestration product.</li>
              </ul>
              <div class="divider"></div>
              <div class="note">
                Layer in the ecosystem: Observability -> Structure ->
                Orchestration. AgentOps owns the structure layer.
              </div>
            </div>
            <div class="card">
              <h3>Differentiation matrix</h3>
              <table class="matrix">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Others</th>
                    <th>AgentOps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cross-tool visibility</td>
                    <td>No</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Persistent structure</td>
                    <td>No</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Context inheritance</td>
                    <td>No</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Org-driven operating model</td>
                    <td>No</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Restructuring intelligence</td>
                    <td>No</td>
                    <td>Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="components">
        <div class="container">
          <div class="section-title">
            <h2>How it works</h2>
            <span>Unified architecture for reliable multi-tool control</span>
          </div>
          <div class="card">
            <ol class="list">${architectureList}</ol>
          </div>
        </div>
      </section>

      <section id="features">
        <div class="container">
          <div class="section-title">
            <h2>Core features</h2>
            <span>Visibility, ownership, and control at team scale</span>
          </div>
          <div class="grid two">${featureCards}</div>
        </div>
      </section>

      <section id="mvp">
        <div class="container">
          <div class="section-title">
            <h2>Customer outcomes</h2>
            <span>What teams get in the first release</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>Core value delivered</h3>
              <ul class="list">${mvpList}</ul>
            </div>
            <div class="card">
              <h3>Who benefits most</h3>
              <ul class="list">${useCaseList}</ul>
              <div class="divider"></div>
              <h3>One-line pitch</h3>
              <p class="note">
                Agent OS is the system that organizes, manages, and gives
                structure to all your AI agents across every tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="vision">
        <div class="container">
          <div class="section-title">
            <h2>Operating principles</h2>
            <span>Design guardrails for every product decision</span>
          </div>
          <div class="card">
            <ul class="list">${principlesList}</ul>
            <div class="divider"></div>
            <ul class="list">${futureList}</ul>
            <div class="cta-row" style="margin-top: 18px;">
              <a class="cta" href="/health">Service status</a>
              <a class="cta secondary" href="#overview">Back to top</a>
            </div>
          </div>
        </div>
      </section>

      <section id="quickstart">
        <div class="container">
          <div class="section-title">
            <h2>Quickstart</h2>
            <span>Open source. Self-hosted. Ship your first setup fast.</span>
          </div>
          <div class="grid two">
            <div class="card">
              <h3>What to expect</h3>
              <ul class="list">${quickstartSteps}</ul>
              <div class="divider"></div>
              <div class="cta-row">
                <a class="cta" href="/app">Launch app at /app</a>
                <a class="cta secondary" href="https://github.com/agentops-dev" rel="noreferrer">Star on GitHub</a>
                <a class="cta secondary" href="https://github.com/agentops-dev/agentops-web#readme" rel="noreferrer">Read the docs</a>
              </div>
            </div>
            <div class="card">
              <h3>Run locally</h3>
              <pre class="quickstart-command">${quickstartCommand}</pre>
              <p class="note" style="margin-top: 12px;">
                <code>onboard</code> copies <code>.env.example</code> to <code>.env</code> when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="early-access">
        <div class="container">
          <div class="conversion">
            <h3>See AgentOps on your workflow</h3>
            <p class="lead" style="margin-bottom: 12px;">
              Bring one active team workflow and we will map your current
              multi-tool agent sprawl into a structured operating model.
            </p>
            <div class="cta-row">
              <a class="cta" href="mailto:founders@agentops.dev?subject=AgentOps%20Early%20Access">
                Join early access
              </a>
              <a class="cta secondary" href="/health">Verify API health</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container">
        <div class="footer-line">
          <span>Built with heart by the AgentOps team.</span>
          <span>AgentOps | Structure over chaos.</span>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
