import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import sweetsRoutes from './routes/sweets.routes';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.get('/', (req, res) => res.send({ ok: true, version: '0.1.0' }));

export default app;
