import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pairingRouter from './api/pairing';
import bridgeRouter from './api/bridge';
import mobileRouter from './api/mobile';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/pair', pairingRouter);
app.use('/bridge', bridgeRouter);
app.use('/mobile', mobileRouter);

app.listen(PORT, () => {
  console.log(`AgentOps Backend listening on port ${PORT}`);
});
