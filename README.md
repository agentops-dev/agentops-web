# AgentOps Backend API

> **Thin orchestrator for mobile agent supervision** - Handles approvals, push notifications, and event coordination.

Part of the [AgentOps](https://github.com/agentops-dev) platform for mobile-first agent supervision.

## 🎯 Goals (v1)

AgentOps enables developers to:

1. **📱 Mobile push notifications** when agents finish, fail, or stop
2. **✋ Mobile approval** of terminal commands before execution
3. **💬 Send instructions mid-run** via approval notes
4. **📊 Audit logs** with complete run timelines

## 🏗️ Architecture Overview

This backend is a **thin orchestrator** that:
- Verifies signed requests from hook runners
- Writes events to Supabase (system of record)
- Sends push notifications to mobile devices
- Manages approval wait/decision channels
- Handles pairing flow

```
┌─────────────────┐
│ Hook Runner     │
│ (VSCode Ext)    │
└────────┬────────┘
         │ HTTPS (HMAC signed)
         ↓
┌─────────────────┐     ┌─────────────────┐
│ Backend API     │────→│ Supabase        │
│ (orchestrator)  │     │ (Postgres)      │
└────────┬────────┘     └─────────────────┘
         │                      ↑
         │ Push (FCM/APNs)      │
         ↓                      │
┌─────────────────┐            │
│ Mobile App      │────────────┘
└─────────────────┘
```

### Design Principles

- **Stateless**: All state in Supabase
- **Thin**: Only handle what Supabase can't (signing, push, approval coordination)
- **Secure**: HMAC verification, nonce replay protection
- **Scalable**: Redis for approval wait channels (v2)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account and project
- Firebase project (for FCM)
- APNs credentials (for iOS push)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone git@github.com:agentops-dev/agentops-web.git
   cd agentops-web
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up Supabase schema:**
   ```bash
   # Run migrations in Supabase SQL editor
   # See: docs/schema.sql (to be created)
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## ⚙️ Configuration

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
HMAC_SECRET=your-hmac-secret-for-signing

# Push Notifications
FCM_SERVER_KEY=your-fcm-server-key
APNS_KEY_ID=your-apns-key-id
APNS_TEAM_ID=your-apns-team-id

# Approval Wait (v2)
REDIS_URL=redis://localhost:6379  # Optional, for scale
```

## 📡 API Endpoints

### Pairing

#### `POST /pair/start`
Start pairing flow from extension.

**Request:**
```json
{
  "machine_id": "uuid",
  "workspace_fingerprint": "hash",
  "display_name": "My Project"
}
```

**Response:**
```json
{
  "pair_token": "abc123",
  "expires_at": "2024-02-08T12:00:00Z"
}
```

#### `POST /pair/complete`
Complete pairing from mobile app.

**Request:**
```json
{
  "pair_token": "abc123",
  "platform": "ios",
  "push_token": "fcm-token"
}
```

**Response:**
```json
{
  "device_id": "uuid",
  "bridge_secret": "hmac-key",
  "workspace_id": "uuid"
}
```

---

### Events

#### `POST /bridge/event`
Submit agent event (signed request).

**Headers:**
```
X-Signature: hmac-sha256-signature
X-Timestamp: unix-timestamp-ms
X-Nonce: uuid
```

**Request:**
```json
{
  "workspace_id": "uuid",
  "run_id": "uuid",
  "provider": "cursor_local",
  "event_type": "RUN_STARTED",
  "event_ts": "2024-02-08T12:00:00Z",
  "payload": {}
}
```

---

### Approvals

#### `POST /bridge/approval/request`
Request approval for command (signed).

**Request:**
```json
{
  "run_id": "uuid",
  "command": "rm -rf node_modules",
  "cwd": "/path/to/project",
  "context": {}
}
```

**Response:**
```json
{
  "approval_id": "uuid"
}
```

#### `GET /bridge/approval/:approvalId/wait`
Long-poll for approval decision.

**Query params:**
- `timeout` - Timeout in seconds (default: 90)

**Response (when decided):**
```json
{
  "status": "APPROVED",
  "note": "Looks good, but check package.json first"
}
```

#### `POST /mobile/approval/:approvalId/decision`
Submit approval decision from mobile.

**Request:**
```json
{
  "decision": "APPROVE",
  "note": "Proceed with caution"
}
```

---

## 📁 Project Structure

```
src/
├── index.ts                  # Express app entry point
├── api/                      # Route handlers
│   ├── pairing.ts           # Pairing endpoints
│   ├── bridge.ts            # Bridge event/approval endpoints
│   └── mobile.ts            # Mobile decision endpoints
├── bridge/                   # Bridge event processing
│   ├── events.ts            # Event handler
│   └── validator.ts         # Signature validation
├── push/                     # Push notification service
│   ├── fcm.ts               # Firebase Cloud Messaging
│   └── apns.ts              # Apple Push Notification Service
├── supabase/                 # Supabase client & queries
│   ├── client.ts            # Supabase client
│   ├── runs.ts              # Run queries
│   ├── events.ts            # Event queries
│   └── approvals.ts         # Approval queries
├── approvals/                # Approval coordination
│   ├── waiter.ts            # Long-poll wait logic
│   └── decider.ts           # Decision handler
├── security/                 # Security utilities
│   ├── hmac.ts              # HMAC verification
│   ├── nonce.ts             # Nonce replay protection
│   └── rate-limit.ts        # Rate limiting (v2)
└── types/                    # TypeScript types
    ├── api.ts               # API request/response types
    └── models.ts            # Domain models
```

## 🔐 Security

### HMAC Request Signing

All `/bridge/*` endpoints require HMAC-SHA256 signatures:

**Signature calculation:**
```typescript
const payload = `${timestamp}:${nonce}:${JSON.stringify(body)}`;
const signature = crypto
  .createHmac('sha256', bridgeSecret)
  .update(payload)
  .digest('hex');
```

**Verification:**
- ✅ Signature matches
- ✅ Timestamp within 5 minutes
- ✅ Nonce not seen before (replay protection)

### Rate Limiting (v2)

Per device rate limits:
- 100 events/minute
- 10 approval requests/minute
- 1000 events/hour

## 🗄️ Supabase Schema

### Tables

**devices**
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES auth.users (nullable for v1)
platform        text CHECK (platform IN ('ios', 'android'))
push_token      text
created_at      timestamptz
updated_at      timestamptz
```

**workspaces**
```sql
id                    uuid PRIMARY KEY
device_id             uuid REFERENCES devices(id)
machine_id            text
display_name          text
project_fingerprint   text
created_at            timestamptz
updated_at            timestamptz
```

**runs**
```sql
id                uuid PRIMARY KEY
provider          text
provider_run_id   text
workspace_id      uuid REFERENCES workspaces(id)
status            text
started_at        timestamptz
ended_at          timestamptz
last_event_at     timestamptz
last_message      text
meta              jsonb
```

**events**
```sql
id          uuid PRIMARY KEY
run_id      uuid REFERENCES runs(id)
type        text
created_at  timestamptz
payload     jsonb
```

**approvals**
```sql
id                    uuid PRIMARY KEY
run_id                uuid REFERENCES runs(id)
status                text CHECK (status IN ('PENDING','APPROVED','DENIED','EXPIRED'))
kind                  text
command               text
cwd_hash              text
note                  text
requested_at          timestamptz
decided_at            timestamptz
decided_by_device_id  uuid REFERENCES devices(id)
```

## 🛠️ Tech Stack

- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 20+
- **Framework**: Express 4.x
- **Database**: Supabase (Postgres)
- **Push**: Firebase Cloud Messaging + APNs
- **Future**: Redis for approval wait channels

## 📦 Related Repositories

- [agentops-vscode-extension](https://github.com/agentops-dev/agentops-vscode-extension) - VSCode extension
- [agentops-mobile](https://github.com/agentops-dev/agentops-mobile) - Flutter mobile app

## 🗺️ Roadmap

### Milestone 1: Approval MVP (2 weeks)
- [ ] Pairing endpoints
- [ ] Approval request/wait/decision
- [ ] Push notifications (FCM)
- [ ] HMAC verification

### Milestone 2: Runs Timeline (2-3 weeks)
- [ ] Event ingestion
- [ ] Run state management
- [ ] Event timeline API

### Milestone 3: Hardening (Ongoing)
- [ ] Redis approval channels
- [ ] Rate limiting
- [ ] Retry/backoff
- [ ] APNs support

## 🤝 Contributing

This is an early-stage project. Contributions welcome!

## 📝 License

MIT

---

**Built with ❤️ by the AgentOps team**
