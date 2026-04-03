import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pairingRouter from './api/pairing';
import bridgeRouter from './api/bridge';
import mobileRouter from './api/mobile';
import agentsRouter from './api/agents';
import orgRouter from './api/org';
import dashboardRouter from './api/dashboard';
import { landingPageHtml } from './landing';
import { appPageHtml } from './app-page';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.type('html').send(landingPageHtml);
});

app.get('/app', (req, res) => {
  res.type('html').send(appPageHtml);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/pair', pairingRouter);
app.use('/bridge', bridgeRouter);
app.use('/mobile', mobileRouter);
app.use('/agents', agentsRouter);
app.use('/org', orgRouter);
app.use('/dashboard', dashboardRouter);

const isVercelRuntime = Boolean(process.env.VERCEL);

if (!isVercelRuntime) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`AgentOps Backend listening on port ${PORT}`);
  });
}

export default app;
