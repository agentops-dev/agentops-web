export const appPageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentOps App | Local Control Plane</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Syne:wght@500;700&family=Manrope:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap");

      :root {
        color-scheme: dark;
        --bg: #000000;
        --bg-2: #0a0a0a;
        --panel: rgba(255, 255, 255, 0.03);
        --panel-strong: rgba(255, 255, 255, 0.06);
        --text: #f5f5f5;
        --muted: #a3a3a3;
        --line: rgba(255, 255, 255, 0.12);
        --accent: #ffffff;
        --accent-soft: rgba(255, 255, 255, 0.18);
        --good: #22c55e;
        --bad: #f43f5e;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: "Manrope", sans-serif;
        background:
          radial-gradient(900px circle at 0% 0%, rgba(255, 255, 255, 0.06), transparent 40%),
          radial-gradient(800px circle at 100% 100%, rgba(255, 255, 255, 0.04), transparent 35%),
          repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.015) 0px,
            rgba(255, 255, 255, 0.015) 1px,
            transparent 1px,
            transparent 12px
          ),
          linear-gradient(180deg, var(--bg-2), var(--bg));
        color: var(--text);
        min-height: 100vh;
      }

      .app-root {
        display: flex;
        min-height: 100vh;
        align-items: stretch;
      }

      .app-sidebar {
        width: 268px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--line);
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(8px);
      }

      .sidebar-section {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }

      .sidebar-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 12px 8px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
        border-bottom: 1px solid var(--line);
        user-select: none;
      }

      .sidebar-header-actions {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .icon-btn {
        appearance: none;
        width: 22px;
        height: 22px;
        padding: 0;
        margin: 0;
        border: 1px solid transparent;
        border-radius: 4px;
        background: transparent;
        color: var(--muted);
        font-size: 18px;
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: color .15s, background .15s, border-color .15s;
      }

      .icon-btn:hover {
        color: var(--text);
        background: var(--panel-strong);
        border-color: var(--line);
      }

      button.icon-btn:hover {
        transform: none;
      }

      .icon-btn:active {
        transform: scale(0.94);
      }

      .icon-btn svg {
        display: block;
      }

      .sidebar-tree {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 6px 0 12px;
      }

      .sidebar-empty {
        padding: 12px 14px;
        font-size: 12px;
        color: var(--muted);
        line-height: 1.45;
      }

      .sidebar-list {
        margin: 0;
        padding: 8px 0 12px;
        list-style: none;
        overflow-y: auto;
      }

      .sidebar-list ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .sidebar-list-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 10px;
        margin: 0 6px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 1.35;
        color: var(--text);
      }

      .sidebar-list-row:hover {
        background: var(--panel);
      }

      .agent-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
        background: var(--muted);
      }

      .agent-status-dot.running {
        background: var(--good);
      }

      .agent-status-dot.failed {
        background: var(--bad);
      }

      .agent-status-dot.idle {
        background: #f59e0b;
      }

      .tree-item {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .tree-row {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px 3px 6px;
        margin: 0 6px;
        border-radius: 6px;
        font-size: 13px;
        line-height: 1.35;
        cursor: default;
        color: var(--text);
      }

      .tree-row:hover {
        background: var(--panel);
      }

      .tree-row-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tree-chevron {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--muted);
        font-size: 9px;
        transition: transform .15s ease;
      }

      .tree-item.is-collapsed > .tree-row .tree-chevron {
        transform: rotate(-90deg);
      }

      .tree-item.is-collapsed > .tree-children {
        display: none;
      }

      .tree-children {
        margin: 0;
        padding: 0 0 2px 0;
        list-style: none;
      }

      .tree-children .tree-row {
        padding-left: 22px;
        color: var(--muted);
        font-size: 12px;
      }

      .tree-children .tree-row:hover {
        color: var(--text);
      }

      .tree-row-spacer {
        width: 18px;
        flex-shrink: 0;
      }

      .tree-leaf-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-soft);
        flex-shrink: 0;
        margin-left: 2px;
        margin-right: 2px;
        opacity: 0.7;
      }

      .app-main {
        flex: 1;
        min-width: 0;
        overflow-y: auto;
      }

      .shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
        animation: fade-in .45s ease-out;
      }

      .topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .brand-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      .brand {
        display: flex;
        align-items: baseline;
        gap: 12px;
      }

      .brand h1 {
        font-family: "Syne", sans-serif;
        margin: 0;
        font-size: 26px;
        letter-spacing: -0.02em;
      }

      .topbar-meta {
        margin: 0;
        font-size: 12px;
        color: var(--muted);
        letter-spacing: 0.02em;
      }

      .topbar-meta.ok {
        color: #86efac;
      }

      .topbar-meta.bad {
        color: var(--bad);
      }

      .topbar-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 14px;
      }

      .topbar-links {
        display: inline-flex;
        gap: 14px;
        font-size: 12px;
      }

      .topbar-links a {
        color: var(--muted);
        text-decoration: none;
      }

      .topbar-links a:hover {
        color: var(--text);
        text-decoration: underline;
      }

      button.btn-quiet {
        border: none;
        background: transparent;
        color: var(--muted);
        padding: 6px 0;
        font-size: 12px;
        font-weight: 500;
        border-radius: 0;
        box-shadow: none;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      button.btn-quiet:hover {
        color: var(--text);
        background: transparent;
        border-color: transparent;
        transform: none;
      }

      button.btn-quiet:active {
        transform: none;
      }

      .tag {
        padding: 4px 10px;
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .08em;
      }

      button, a.btn {
        appearance: none;
        border: 1px solid var(--line);
        background: var(--panel);
        color: var(--text);
        border-radius: 999px;
        padding: 9px 14px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: .2s ease;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
      }

      button:hover, a.btn:hover {
        transform: translateY(-1px);
        border-color: rgba(255, 255, 255, 0.35);
        background: var(--panel-strong);
      }

      button:active, a.btn:active {
        transform: translateY(0);
      }

      button:disabled {
        opacity: 0.42;
        cursor: not-allowed;
        transform: none;
      }

      button:disabled:hover {
        transform: none;
        border-color: var(--line);
        background: var(--panel);
      }

      .card {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
        border-radius: 18px;
        padding: 16px;
        position: relative;
        overflow: hidden;
      }

      .card::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 38%);
      }

      .card h2, .card h3 {
        margin: 0 0 10px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--muted);
      }

      .form-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.72);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-backdrop.open {
        display: flex;
      }

      .modal {
        width: min(460px, calc(100vw - 32px));
        border: 1px solid var(--line);
        background: #0a0a0a;
        border-radius: 16px;
        padding: 16px;
      }

      .modal h3 {
        margin: 0 0 6px;
        font-size: 16px;
      }

      .modal p {
        margin: 0 0 12px;
        color: var(--muted);
        font-size: 13px;
      }

      input, select {
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.02);
        color: var(--text);
        border-radius: 10px;
        padding: 10px 12px;
        min-width: 220px;
        font-family: "Manrope", sans-serif;
      }

      input:focus, select:focus {
        outline: none;
        border-color: var(--accent-soft);
        box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
      }

      pre {
        margin: 0;
        border: 1px solid var(--line);
        background: #050505;
        border-radius: 14px;
        padding: 12px;
        max-height: 300px;
        overflow: auto;
        font-size: 12px;
        line-height: 1.5;
        font-family: "JetBrains Mono", monospace;
      }

      .subtle {
        margin: 0 0 14px;
        color: var(--muted);
        font-size: 14px;
      }

      .main-stack {
        display: grid;
        gap: 12px;
        max-width: 560px;
      }

      pre.pre-quiet {
        color: var(--muted);
        font-style: normal;
      }

      @media (max-width: 720px) {
        .app-root { flex-direction: column; }
        .app-sidebar {
          width: 100%;
          max-height: min(220px, 38vh);
          border-right: none;
          border-bottom: 1px solid var(--line);
        }
      }

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>
  <body>
    <div class="app-root">
      <aside class="app-sidebar" aria-label="Workspace">
        <div class="sidebar-section">
          <div class="sidebar-section-header">
            <span>Projects</span>
            <div class="sidebar-header-actions">
              <button type="button" id="sidebarNewProject" class="icon-btn" title="New Project">+</button>
              <button type="button" id="sidebarNewFolder" class="icon-btn" disabled title="Create a project first" aria-label="New Folder">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </button>
            </div>
          </div>
          <div id="sidebarTree" class="sidebar-tree" role="tree" aria-label="Project list"></div>
        </div>
        <div class="sidebar-section" style="border-top: 1px solid var(--line); max-height: 38%;">
          <div class="sidebar-section-header">
            <span>Detected Agents</span>
          </div>
          <div id="sidebarAgents" class="sidebar-list" role="list" aria-label="Detected agents list"></div>
        </div>
      </aside>
      <div class="app-main">
        <div class="shell">
      <div class="topbar">
        <div class="brand-block">
          <div class="brand">
            <h1>AgentOps</h1>
            <span class="tag">/app</span>
          </div>
          <p class="topbar-meta" id="topbarMeta">Loading…</p>
        </div>
        <div class="topbar-actions">
          <button type="button" id="refresh" title="Scan for local agents and reload data">Refresh</button>
          <button type="button" id="testEvent" class="btn-quiet">Test event</button>
          <span class="topbar-links">
            <a href="/">Site</a>
            <a href="/health" target="_blank" rel="noreferrer">Health</a>
          </span>
        </div>
      </div>

      <div class="main-stack">
        <div id="runsCard" class="card" style="display: none;">
          <h3>Recent runs</h3>
          <pre id="runsJson"></pre>
        </div>
      </div>
        </div>
      </div>
    </div>

    <div id="projectModalBackdrop" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="projectModalTitle">
      <div class="modal">
        <h3 id="projectModalTitle">Create Project</h3>
        <p>Enter a project name to continue.</p>
        <div class="form-row" style="margin-bottom: 10px;">
          <input id="projectNameInput" placeholder="My Project" />
        </div>
        <div class="form-row">
          <button id="confirmCreateProject">Create</button>
          <button id="cancelCreateProject">Cancel</button>
        </div>
      </div>
    </div>

    <div id="folderModalBackdrop" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="folderModalTitle">
      <div class="modal">
        <h3 id="folderModalTitle">Create Folder</h3>
        <p>Select project and set folder name.</p>
        <div class="form-row" style="margin-bottom: 10px;">
          <select id="folderProjectSelect"></select>
          <input id="folderNameInput" placeholder="Core Team" />
        </div>
        <div class="form-row">
          <button id="confirmCreateFolder">Create</button>
          <button id="cancelCreateFolder">Cancel</button>
        </div>
      </div>
    </div>

    <script>
      async function getJson(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(path + " -> " + res.status);
        return res.json();
      }

      async function postJson(path, body) {
        const res = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body || {}),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(path + " -> " + res.status + " " + JSON.stringify(data));
        return data;
      }

      function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      }

      function logAction() {
        /* no on-page log */
      }

      function escapeHtml(s) {
        return String(s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      async function refreshSidebarTree() {
        const mount = document.getElementById('sidebarTree');
        if (!mount) return;
        try {
          const projects = await fetchProjectsList();
          if (projects.length === 0) {
            mount.innerHTML =
              '<div class="sidebar-empty">No projects yet. Click <strong>+</strong> above to add one.</div>';
            return;
          }
          const folderLists = await Promise.all(
            projects.map((p) =>
              getJson('/org/projects/' + p.id + '/folders').catch(() => ({ folders: [] })),
            ),
          );
          const parts = ['<ul role="group">'];
          for (let i = 0; i < projects.length; i++) {
            const p = projects[i];
            const folders = Array.isArray(folderLists[i]?.folders) ? folderLists[i].folders : [];
            const idAttr = escapeHtml(p.id);
            const nameHtml = escapeHtml(p.name);
            if (folders.length === 0) {
              parts.push(
                '<li class="tree-item tree-project" data-project-id="' +
                  idAttr +
                  '"><div class="tree-row"><span class="tree-row-spacer" aria-hidden="true"></span><span class="tree-row-label">' +
                  nameHtml +
                  '</span></div></li>',
              );
            } else {
              const childRows = folders
                .map(
                  (f) =>
                    '<li class="tree-item"><div class="tree-row"><span class="tree-leaf-dot" aria-hidden="true"></span><span class="tree-row-label">' +
                    escapeHtml(f.name) +
                    '</span></div></li>',
                )
                .join('');
              parts.push(
                '<li class="tree-item tree-project" data-project-id="' +
                  idAttr +
                  '"><div class="tree-row"><span class="tree-chevron" role="button" tabindex="0" aria-expanded="true" title="Expand or collapse">▼</span><span class="tree-row-label">' +
                  nameHtml +
                  '</span></div><ul class="tree-children" role="group">' +
                  childRows +
                  '</ul></li>',
              );
            }
          }
          parts.push('</ul>');
          mount.innerHTML = parts.join('');
        } catch {
          mount.innerHTML = '<div class="sidebar-empty">Could not load projects.</div>';
        }
      }

      async function fetchAgentsList() {
        const agentsData = await getJson('/dashboard/agents');
        return Array.isArray(agentsData?.agents) ? agentsData.agents : [];
      }

      function agentStatusClass(value) {
        const status = String(value || '').toLowerCase();
        if (status === 'running') return 'running';
        if (status === 'failed') return 'failed';
        if (status === 'idle') return 'idle';
        return '';
      }

      async function refreshSidebarAgents() {
        const mount = document.getElementById('sidebarAgents');
        if (!mount) return;
        try {
          const agents = await fetchAgentsList();
          if (!agents.length) {
            mount.innerHTML = '<div class="sidebar-empty">No agents detected yet.</div>';
            return;
          }
          mount.innerHTML =
            '<ul>' +
            agents
              .slice(0, 20)
              .map((agent) => {
                const label = escapeHtml(
                  String(agent.displayName || agent.provider || agent.id || 'Unknown'),
                );
                const statusLabel = escapeHtml(String(agent.status || 'UNKNOWN'));
                const dotClass = agentStatusClass(agent.status);
                return (
                  '<li class="sidebar-list-row" role="listitem"><span class="agent-status-dot ' +
                  dotClass +
                  '" aria-hidden="true"></span><span class="tree-row-label">' +
                  label +
                  '</span><span style="color: var(--muted); font-size: 11px;">' +
                  statusLabel +
                  '</span></li>'
                );
              })
              .join('') +
            '</ul>';
        } catch {
          mount.innerHTML = '<div class="sidebar-empty">Could not load agents.</div>';
        }
      }

      function openProjectModal() {
        const backdrop = document.getElementById('projectModalBackdrop');
        const input = document.getElementById('projectNameInput');
        if (backdrop) backdrop.classList.add('open');
        if (input) {
          input.value = '';
          input.focus();
        }
      }

      function closeProjectModal() {
        const backdrop = document.getElementById('projectModalBackdrop');
        if (backdrop) backdrop.classList.remove('open');
      }

      function openFolderModal() {
        const backdrop = document.getElementById('folderModalBackdrop');
        if (backdrop) backdrop.classList.add('open');
      }

      function closeFolderModal() {
        const backdrop = document.getElementById('folderModalBackdrop');
        if (backdrop) backdrop.classList.remove('open');
      }

      async function fetchProjectsList() {
        const projects = await getJson('/org/projects');
        return Array.isArray(projects?.projects) ? projects.projects : [];
      }

      async function syncOrgActionButtons() {
        const list = await fetchProjectsList();
        const folderIconBtn = document.getElementById('sidebarNewFolder');
        if (folderIconBtn) {
          folderIconBtn.disabled = list.length === 0;
          folderIconBtn.title = list.length === 0 ? 'Create a project first' : 'New Folder';
        }
      }

      async function loadProjectOptions(selectId) {
        const select = document.getElementById(selectId);
        const list = await fetchProjectsList();
        if (!select) return list;
        select.innerHTML = list
          .map(
            (project) =>
              '<option value="' +
              escapeHtml(project.id) +
              '">' +
              escapeHtml(project.name) +
              '</option>',
          )
          .join('');
        return list;
      }

      async function refresh() {
        try {
          await fetch('/agents/detect', { method: 'POST' });
          const [health, agents, runs, events] = await Promise.all([
            getJson('/health'),
            getJson('/dashboard/agents'),
            getJson('/dashboard/runs'),
            getJson('/dashboard/events?limit=25'),
          ]);

          const agentsLen = (agents.agents || []).length;
          const runList = runs.runs || [];
          const runsLen = runList.length;
          const eventsLen = (events.events || []).length;
          const meta = document.getElementById('topbarMeta');
          if (meta) {
            const online = health.status === 'ok';
            meta.textContent =
              (online ? 'Online' : 'Check API') +
              ' · ' +
              agentsLen +
              ' agents · ' +
              runsLen +
              ' runs · ' +
              eventsLen +
              ' events';
            meta.className = 'topbar-meta ' + (online ? 'ok' : 'bad');
          }
          const runsCard = document.getElementById('runsCard');
          const runsEl = document.getElementById('runsJson');
          if (runsCard && runsEl) {
            if (runList.length === 0) {
              runsCard.style.display = 'none';
            } else {
              runsCard.style.display = '';
              runsEl.classList.remove('pre-quiet');
              runsEl.textContent = JSON.stringify(runList.slice(0, 10), null, 2);
            }
          }
        } catch (err) {
          const meta = document.getElementById('topbarMeta');
          if (meta) {
            meta.textContent = 'Offline — could not reach API';
            meta.className = 'topbar-meta bad';
          }
          const runsCard = document.getElementById('runsCard');
          const runsEl = document.getElementById('runsJson');
          if (runsCard && runsEl) {
            runsCard.style.display = '';
            runsEl.textContent = 'Could not load runs.';
            runsEl.classList.add('pre-quiet');
          }
        }
        try {
          await syncOrgActionButtons();
        } catch {
          const folderIconBtn = document.getElementById('sidebarNewFolder');
          if (folderIconBtn) {
            folderIconBtn.disabled = true;
            folderIconBtn.title = 'Create a project first';
          }
        }
        try {
          await refreshSidebarTree();
        } catch {
          /* sidebar optional */
        }
        try {
          await refreshSidebarAgents();
        } catch {
          /* sidebar optional */
        }
      }

      async function createProjectAndLog() {
        const input = document.getElementById('projectNameInput');
        const rawName = input && typeof input.value === 'string' ? input.value : '';
        const name = rawName.trim() || 'My Project';
        const result = await postJson('/org/projects', { name });
        logAction(result);
      }

      async function createFolderAndLog() {
        const projectSelect = document.getElementById('folderProjectSelect');
        const folderInput = document.getElementById('folderNameInput');
        const projectId = projectSelect && projectSelect.value ? projectSelect.value : null;
        const rawName = folderInput && typeof folderInput.value === 'string' ? folderInput.value : '';
        const name = rawName.trim() || 'Core Team';
        if (!projectId) throw new Error('Create a project first');
        const result = await postJson('/org/folders', { project_id: projectId, name });
        logAction(result);
      }

      async function sendTestEventAndLog() {
        const result = await postJson('/dashboard/dev/test-event', {});
        logAction(result);
      }

      document.getElementById('refresh').addEventListener('click', refresh);
      document.getElementById('testEvent').addEventListener('click', async () => {
        try {
          await sendTestEventAndLog();
          await refresh();
        } catch (err) {
          logAction(String(err));
        }
      });
      document.getElementById('sidebarNewProject').addEventListener('click', () => {
        openProjectModal();
      });

      async function openCreateFolderFlow() {
        const projects = await loadProjectOptions('folderProjectSelect');
        if (!projects.length) throw new Error('Create a project first');
        const folderInput = document.getElementById('folderNameInput');
        if (folderInput && 'value' in folderInput) folderInput.value = '';
        openFolderModal();
        if (folderInput && typeof folderInput.focus === 'function') folderInput.focus();
      }

      document.getElementById('sidebarNewFolder').addEventListener('click', async () => {
        try {
          await openCreateFolderFlow();
        } catch (err) {
          logAction(String(err));
        }
      });

      document.getElementById('sidebarTree').addEventListener('click', (event) => {
        const target = event.target;
        if (!target || !target.closest) return;
        const chevron = target.closest('.tree-chevron');
        if (chevron) {
          event.preventDefault();
          const item = chevron.closest('.tree-item');
          if (!item || !item.classList.contains('tree-project')) return;
          const collapsed = item.classList.toggle('is-collapsed');
          chevron.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }
      });

      document.getElementById('sidebarTree').addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const target = event.target;
        if (!target || !target.classList || !target.classList.contains('tree-chevron')) return;
        event.preventDefault();
        target.click();
      });
      document.getElementById('confirmCreateProject').addEventListener('click', async () => {
        try {
          await createProjectAndLog();
          closeProjectModal();
          await refresh();
        } catch (err) {
          logAction(String(err));
        }
      });
      document.getElementById('cancelCreateProject').addEventListener('click', () => {
        closeProjectModal();
      });
      document.getElementById('confirmCreateFolder').addEventListener('click', async () => {
        try {
          await createFolderAndLog();
          closeFolderModal();
          await refresh();
        } catch (err) {
          logAction(String(err));
        }
      });
      document.getElementById('cancelCreateFolder').addEventListener('click', () => {
        closeFolderModal();
      });
      document.getElementById('projectModalBackdrop').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'projectModalBackdrop') {
          closeProjectModal();
        }
      });
      document.getElementById('folderModalBackdrop').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'folderModalBackdrop') {
          closeFolderModal();
        }
      });
      refresh();
    </script>
  </body>
</html>
`;
