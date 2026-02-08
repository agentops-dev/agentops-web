# AgentOps Backend

Thin orchestrator API for agent supervision, approvals, and push notifications.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Structure

- `src/api/` - Express route handlers
- `src/bridge/` - Bridge event processing
- `src/push/` - Push notification service (FCM/APNs)
- `src/supabase/` - Supabase client and queries
- `src/approvals/` - Approval wait/decision logic
- `src/security/` - HMAC signing, nonce validation
- `src/types/` - TypeScript types
