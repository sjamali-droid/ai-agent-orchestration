import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileRouter } from './routes/files';

dotenv.config();

const app = express();
const PORT = process.env.FILE_SERVICE_PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'file-service' });
});

app.use('/files', fileRouter);

app.listen(PORT, () => {
  console.log(`file-service running on port ${PORT}`);
});

export default app;
