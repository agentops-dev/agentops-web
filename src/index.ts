import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.post('/pair/start', (req, res) => {
  res.json({ message: 'Pairing start endpoint - TODO' });
});

app.post('/pair/complete', (req, res) => {
  res.json({ message: 'Pairing complete endpoint - TODO' });
});

app.post('/bridge/event', (req, res) => {
  res.json({ message: 'Bridge event endpoint - TODO' });
});

app.post('/bridge/approval/request', (req, res) => {
  res.json({ message: 'Approval request endpoint - TODO' });
});

app.get('/bridge/approval/:approvalId/wait', (req, res) => {
  res.json({ message: 'Approval wait endpoint - TODO' });
});

app.post('/mobile/approval/:approvalId/decision', (req, res) => {
  res.json({ message: 'Approval decision endpoint - TODO' });
});

app.listen(PORT, () => {
  console.log(`AgentOps Backend listening on port ${PORT}`);
});
