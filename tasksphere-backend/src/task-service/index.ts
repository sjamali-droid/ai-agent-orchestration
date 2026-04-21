import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { taskRouter } from './routes/tasks';
import { commentRouter } from './routes/comments';

dotenv.config();

const app = express();
const PORT = process.env.TASK_SERVICE_PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'task-service' });
});

app.use('/tasks', taskRouter);
app.use('/comments', commentRouter);

app.listen(PORT, () => {
  console.log(`task-service running on port ${PORT}`);
});

export default app;
