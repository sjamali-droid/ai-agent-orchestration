import { Kafka, Producer, Consumer } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

const kafka = new Kafka({
  clientId: 'tasksphere',
  brokers,
});

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
}

export async function publishEvent(topic: string, payload: Record<string, unknown>): Promise<void> {
  const p = await getProducer();
  await p.send({
    topic,
    messages: [{ value: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }) }],
  });
}

export function createConsumer(groupId: string): Consumer {
  return kafka.consumer({ groupId });
}

export async function disconnectProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
}
