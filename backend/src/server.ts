import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { blueprintRouter } from './routes/blueprint';
import { sharedRouter } from './routes/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'atich-api' });
});

app.use('/api/blueprint', blueprintRouter);
app.use('/api/shared', sharedRouter);

// Serve the frontend's production build as static files for the single-container Docker setup
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Atich backend running on port ${PORT}`);
});
