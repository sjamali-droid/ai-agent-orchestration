import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { notificationRouter } from './routes/notifications';
import { startKafkaConsumer } from './consumer';

dotenv.config();

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

app.use('/notifications', notificationRouter);

app.listen(PORT, () => {
  console.log(`notification-service running on port ${PORT}`);
  startKafkaConsumer().catch((err) => console.error('Kafka consumer failed to start:', err));
});

export default app;
