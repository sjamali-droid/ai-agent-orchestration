import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { projectRouter } from './routes/projects';

dotenv.config();

const app = express();
const PORT = process.env.PROJECT_SERVICE_PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'project-service' });
});

app.use('/projects', projectRouter);

app.listen(PORT, () => {
  console.log(`project-service running on port ${PORT}`);
});

export default app;
