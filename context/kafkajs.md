# KafkaJS (Node.js Kafka Client)

> **Used by**: Developer, Architect
> **What to paste**: producer API, consumer API, admin API, configuration options, serialization patterns, error handling, SASL/SSL config.
> **Source**: https://kafka.js.org/docs/getting-started

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Apache Kafka

Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. It provides a unified, high-throughput, low-latency platform for handling real-time data feeds with durability guarantees through a distributed commit log.

Kafka's architecture consists of brokers that store and serve data, producers that publish messages to topics, consumers that subscribe to topics and process messages, and the ZooKeeper/KRaft coordination layer. The platform supports exactly-once semantics, transactional messaging, and provides client libraries in Java along with a rich ecosystem including Kafka Streams for stream processing and Kafka Connect for data integration with external systems.

## Producer API - KafkaProducer

The KafkaProducer is a thread-safe client for publishing records to a Kafka cluster. It handles batching, compression, and asynchronous sending of records with configurable durability guarantees through the `acks` setting.

```java
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;
import java.util.Properties;
import java.util.concurrent.Future;

public class ProducerExample {
    public static void main(String[] args) {
        // Configure the producer
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.ACKS_CONFIG, "all");  // Wait for all replicas
        props.put(ProducerConfig.LINGER_MS_CONFIG, 5);  // Batch for 5ms
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);  // 16KB batch size

        try (Producer<String, String> producer = new KafkaProducer<>(props)) {
            // Asynchronous send with callback
            for (int i = 0; i < 100; i++) {
                ProducerRecord<String, String> record = new ProducerRecord<>(
                    "my-topic",           // topic
                    "key-" + i,           // key
                    "message-" + i        // value
                );

                producer.send(record, (metadata, exception) -> {
                    if (exception != null) {
                        System.err.println("Send failed: " + exception.getMessage());
                    } else {
                        System.out.printf("Sent to partition %d, offset %d%n",
                            metadata.partition(), metadata.offset());
                    }
                });
            }

            // Synchronous send (blocks until acknowledged)
            Future<RecordMetadata> future = producer.send(
                new ProducerRecord<>("my-topic", "sync-key", "sync-value"));
            RecordMetadata metadata = future.get();  // Blocks
            System.out.println("Sync send offset: " + metadata.offset());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## Transactional Producer API

The transactional producer enables exactly-once semantics by grouping multiple sends into atomic transactions. This ensures that either all messages in a transaction are committed or none are visible to consumers.

```java
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;
import java.util.Properties;

public class TransactionalProducerExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "my-transactional-id");
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);  // Required for transactions

        Producer<String, String> producer = new KafkaProducer<>(props);

        // Initialize transactions (must be called once before any transactional methods)
        producer.initTransactions();

        try {
            producer.beginTransaction();

            // Send multiple messages as part of a single transaction
            for (int i = 0; i < 100; i++) {
                producer.send(new ProducerRecord<>("topic-1", "key", "value-" + i));
                producer.send(new ProducerRecord<>("topic-2", "key", "value-" + i));
            }

            // Commit the transaction - all messages become visible atomically
            producer.commitTransaction();
            System.out.println("Transaction committed successfully");

        } catch (ProducerFencedException | OutOfOrderSequenceException e) {
            // Fatal errors - cannot recover, must close producer
            producer.close();
        } catch (KafkaException e) {
            // Abort transaction on other errors and retry
            producer.abortTransaction();
            System.err.println("Transaction aborted: " + e.getMessage());
        } finally {
            producer.close();
        }
    }
}
```

## Consumer API - KafkaConsumer

The KafkaConsumer reads records from Kafka topics. It supports consumer groups for load balancing across multiple consumers and provides manual and automatic offset management.

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class ConsumerExample {
    public static void main(String[] args) {
        // Configure the consumer
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-consumer-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, "500");

        try (Consumer<String, String> consumer = new KafkaConsumer<>(props)) {
            // Subscribe to topics
            consumer.subscribe(Arrays.asList("topic-1", "topic-2"));

            // Poll loop
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

                for (ConsumerRecord<String, String> record : records) {
                    System.out.printf("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s%n",
                        record.topic(),
                        record.partition(),
                        record.offset(),
                        record.key(),
                        record.value());
                }
            }
        }
    }
}
```

## Consumer with Manual Offset Control

Manual offset control provides precise control over when records are considered consumed, enabling at-least-once or exactly-once processing semantics.

```java
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import java.time.Duration;
import java.util.*;

public class ManualOffsetConsumerExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "manual-offset-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");  // Disable auto-commit

        try (Consumer<String, String> consumer = new KafkaConsumer<>(props)) {
            consumer.subscribe(Arrays.asList("my-topic"));

            List<ConsumerRecord<String, String>> buffer = new ArrayList<>();
            final int minBatchSize = 200;

            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

                for (ConsumerRecord<String, String> record : records) {
                    buffer.add(record);
                }

                if (buffer.size() >= minBatchSize) {
                    // Process the batch
                    processRecords(buffer);

                    // Commit offsets after successful processing
                    consumer.commitSync();
                    System.out.println("Committed offsets for " + buffer.size() + " records");
                    buffer.clear();
                }
            }
        }
    }

    // Commit specific offsets per partition
    public static void commitSpecificOffsets(Consumer<String, String> consumer) {
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));

        for (TopicPartition partition : records.partitions()) {
            List<ConsumerRecord<String, String>> partitionRecords = records.records(partition);

            for (ConsumerRecord<String, String> record : partitionRecords) {
                // Process record
                System.out.println(record.offset() + ": " + record.value());
            }

            // Commit offset for this partition
            long lastOffset = partitionRecords.get(partitionRecords.size() - 1).offset();
            consumer.commitSync(Collections.singletonMap(
                partition,
                new OffsetAndMetadata(lastOffset + 1)  // Next offset to read
            ));
        }
    }

    private static void processRecords(List<ConsumerRecord<String, String>> records) {
        // Business logic here
    }
}
```

## Admin API - Managing Topics and Cluster

The Admin API provides methods for managing topics, ACLs, configurations, and inspecting the cluster. All operations are asynchronous and return KafkaFuture objects.

```java
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.common.config.ConfigResource;
import org.apache.kafka.common.config.TopicConfig;
import java.util.*;
import java.util.concurrent.ExecutionException;

public class AdminClientExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

        try (Admin admin = Admin.create(props)) {
            // Create a topic
            NewTopic newTopic = new NewTopic("new-topic", 3, (short) 2)
                .configs(Map.of(
                    TopicConfig.CLEANUP_POLICY_CONFIG, TopicConfig.CLEANUP_POLICY_COMPACT,
                    TopicConfig.RETENTION_MS_CONFIG, "604800000"  // 7 days
                ));

            CreateTopicsResult createResult = admin.createTopics(Collections.singleton(newTopic));
            createResult.all().get();  // Wait for completion
            System.out.println("Topic created successfully");

            // List all topics
            ListTopicsResult listResult = admin.listTopics();
            Set<String> topics = listResult.names().get();
            System.out.println("Topics: " + topics);

            // Describe topics
            DescribeTopicsResult describeResult = admin.describeTopics(Collections.singleton("new-topic"));
            Map<String, TopicDescription> descriptions = describeResult.allTopicNames().get();
            for (TopicDescription desc : descriptions.values()) {
                System.out.printf("Topic: %s, Partitions: %d%n",
                    desc.name(), desc.partitions().size());
            }

            // Get topic configuration
            ConfigResource resource = new ConfigResource(ConfigResource.Type.TOPIC, "new-topic");
            DescribeConfigsResult configResult = admin.describeConfigs(Collections.singleton(resource));
            Map<ConfigResource, Config> configs = configResult.all().get();
            Config config = configs.get(resource);
            System.out.println("Retention: " + config.get(TopicConfig.RETENTION_MS_CONFIG).value());

            // Delete topic
            DeleteTopicsResult deleteResult = admin.deleteTopics(Collections.singleton("new-topic"));
            deleteResult.all().get();
            System.out.println("Topic deleted successfully");
        }
    }
}
```

## Consumer Group Management

The Admin API allows managing consumer groups, including listing groups, describing their state, and managing offsets.

```java
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import java.util.*;
import java.util.concurrent.ExecutionException;

public class ConsumerGroupAdminExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

        try (Admin admin = Admin.create(props)) {
            // List consumer groups
            ListConsumerGroupsResult listGroups = admin.listConsumerGroups();
            Collection<ConsumerGroupListing> groups = listGroups.all().get();
            for (ConsumerGroupListing group : groups) {
                System.out.println("Group: " + group.groupId() + ", State: " + group.state());
            }

            // Describe a consumer group
            DescribeConsumerGroupsResult describeGroups = admin.describeConsumerGroups(
                Collections.singleton("my-consumer-group"));
            Map<String, ConsumerGroupDescription> descriptions = describeGroups.all().get();

            ConsumerGroupDescription groupDesc = descriptions.get("my-consumer-group");
            System.out.println("Group state: " + groupDesc.state());
            for (MemberDescription member : groupDesc.members()) {
                System.out.printf("Member: %s, Host: %s, Partitions: %s%n",
                    member.consumerId(),
                    member.host(),
                    member.assignment().topicPartitions());
            }

            // List consumer group offsets
            ListConsumerGroupOffsetsResult offsetsResult = admin.listConsumerGroupOffsets("my-consumer-group");
            Map<TopicPartition, OffsetAndMetadata> offsets = offsetsResult.partitionsToOffsetAndMetadata().get();
            for (Map.Entry<TopicPartition, OffsetAndMetadata> entry : offsets.entrySet()) {
                System.out.printf("Partition: %s, Offset: %d%n",
                    entry.getKey(), entry.getValue().offset());
            }

            // Reset offsets for a consumer group (group must be inactive)
            Map<TopicPartition, OffsetAndMetadata> newOffsets = new HashMap<>();
            newOffsets.put(new TopicPartition("my-topic", 0), new OffsetAndMetadata(0L));

            AlterConsumerGroupOffsetsResult alterResult = admin.alterConsumerGroupOffsets(
                "my-consumer-group", newOffsets);
            alterResult.all().get();
            System.out.println("Offsets reset successfully");
        }
    }
}
```

## Kafka Streams API - Stream Processing

Kafka Streams is a client library for building real-time streaming applications. It provides a high-level DSL for common operations like filtering, mapping, grouping, aggregating, and joining streams.

```java
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;
import java.time.Duration;
import java.util.Properties;

public class StreamsExample {
    public static void main(String[] args) {
        // Configure Kafka Streams
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "word-count-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        // Build the topology using StreamsBuilder
        StreamsBuilder builder = new StreamsBuilder();

        // Read from input topic
        KStream<String, String> textLines = builder.stream("text-input");

        // Word count processing
        KTable<String, Long> wordCounts = textLines
            // Split each text line into words
            .flatMapValues(value -> Arrays.asList(value.toLowerCase().split("\\W+")))
            // Filter out empty strings
            .filter((key, word) -> word != null && !word.isEmpty())
            // Group by word
            .groupBy((key, word) -> word)
            // Count occurrences
            .count(Materialized.as("word-counts-store"));

        // Write results to output topic
        wordCounts.toStream().to("word-count-output",
            Produced.with(Serdes.String(), Serdes.Long()));

        // Build and start the application
        KafkaStreams streams = new KafkaStreams(builder.build(), props);

        // Add shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));

        streams.start();
        System.out.println("Kafka Streams application started");
    }
}
```

## Kafka Streams - Windowed Aggregations

Windowed operations allow processing records within time-based windows, useful for computing metrics over specific time intervals.

```java
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;
import java.time.Duration;
import java.util.Properties;

public class WindowedStreamsExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "windowed-aggregation-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.Long().getClass());

        StreamsBuilder builder = new StreamsBuilder();

        KStream<String, Long> events = builder.stream(
            "events",
            Consumed.with(Serdes.String(), Serdes.Long()));

        // Tumbling window: fixed-size, non-overlapping windows
        KTable<Windowed<String>, Long> tumblingWindowCounts = events
            .groupByKey()
            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
            .count(Materialized.as("tumbling-window-counts"));

        // Hopping window: fixed-size, overlapping windows
        KTable<Windowed<String>, Long> hoppingWindowCounts = events
            .groupByKey()
            .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofMinutes(5), Duration.ofMinutes(1))
                .advanceBy(Duration.ofMinutes(1)))  // Hop every 1 minute
            .count(Materialized.as("hopping-window-counts"));

        // Session window: variable-size windows based on activity
        KTable<Windowed<String>, Long> sessionCounts = events
            .groupByKey()
            .windowedBy(SessionWindows.ofInactivityGapWithNoGrace(Duration.ofMinutes(10)))
            .count(Materialized.as("session-counts"));

        // Output windowed results
        tumblingWindowCounts.toStream()
            .map((windowedKey, count) -> KeyValue.pair(
                windowedKey.key() + "@" + windowedKey.window().start(),
                count))
            .to("windowed-counts-output", Produced.with(Serdes.String(), Serdes.Long()));

        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();
    }
}
```

## Kafka Streams - KTable and Joins

KTable represents a changelog stream where each record is an update to the table. Streams and tables can be joined for enrichment.

```java
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;
import org.apache.kafka.streams.state.KeyValueStore;
import java.util.Properties;

public class TableJoinExample {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "table-join-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        StreamsBuilder builder = new StreamsBuilder();

        // Create a KTable from a topic (compacted topic recommended)
        KTable<String, String> userProfiles = builder.table(
            "user-profiles",
            Consumed.with(Serdes.String(), Serdes.String()),
            Materialized.<String, String, KeyValueStore<Bytes, byte[]>>as("user-profiles-store"));

        // Create a KStream of user events
        KStream<String, String> userEvents = builder.stream("user-events");

        // Stream-Table Join: Enrich events with user profile data
        KStream<String, String> enrichedEvents = userEvents.join(
            userProfiles,
            (event, profile) -> event + " | Profile: " + profile);

        enrichedEvents.to("enriched-events");

        // Left Join: Include events even if no matching profile
        KStream<String, String> leftJoinResult = userEvents.leftJoin(
            userProfiles,
            (event, profile) -> event + " | Profile: " + (profile != null ? profile : "UNKNOWN"));

        leftJoinResult.to("left-join-events");

        // Table-Table Join
        KTable<String, String> userPreferences = builder.table("user-preferences");

        KTable<String, String> combinedUserData = userProfiles.join(
            userPreferences,
            (profile, preferences) -> "Profile: " + profile + ", Preferences: " + preferences);

        combinedUserData.toStream().to("combined-user-data");

        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        streams.start();
    }
}
```

## Kafka Connect - Source Connector

Kafka Connect provides a framework for streaming data between Kafka and external systems. Source connectors import data from external systems into Kafka.

```java
import org.apache.kafka.connect.source.*;
import org.apache.kafka.common.config.ConfigDef;
import java.util.*;

public class SimpleSourceConnector extends SourceConnector {
    private Map<String, String> config;

    @Override
    public String version() {
        return "1.0.0";
    }

    @Override
    public void start(Map<String, String> props) {
        this.config = props;
    }

    @Override
    public Class<? extends Task> taskClass() {
        return SimpleSourceTask.class;
    }

    @Override
    public List<Map<String, String>> taskConfigs(int maxTasks) {
        List<Map<String, String>> configs = new ArrayList<>();
        for (int i = 0; i < maxTasks; i++) {
            Map<String, String> taskConfig = new HashMap<>(config);
            taskConfig.put("task.id", String.valueOf(i));
            configs.add(taskConfig);
        }
        return configs;
    }

    @Override
    public void stop() {
        // Cleanup resources
    }

    @Override
    public ConfigDef config() {
        return new ConfigDef()
            .define("topic", ConfigDef.Type.STRING, ConfigDef.Importance.HIGH, "Target topic")
            .define("poll.interval.ms", ConfigDef.Type.INT, 1000, ConfigDef.Importance.MEDIUM, "Poll interval");
    }
}

// Source Task implementation
class SimpleSourceTask extends SourceTask {
    private String topic;
    private long offset = 0;

    @Override
    public String version() {
        return "1.0.0";
    }

    @Override
    public void start(Map<String, String> props) {
        this.topic = props.get("topic");

        // Restore offset from context if available
        Map<String, Object> offsetMap = context.offsetStorageReader()
            .offset(Collections.singletonMap("partition", "0"));
        if (offsetMap != null) {
            offset = (Long) offsetMap.get("offset");
        }
    }

    @Override
    public List<SourceRecord> poll() throws InterruptedException {
        Thread.sleep(1000);  // Simulate polling interval

        List<SourceRecord> records = new ArrayList<>();

        Map<String, String> sourcePartition = Collections.singletonMap("partition", "0");
        Map<String, Long> sourceOffset = Collections.singletonMap("offset", ++offset);

        records.add(new SourceRecord(
            sourcePartition,
            sourceOffset,
            topic,
            null,  // partition (null = let Kafka decide)
            null,  // key schema
            "key-" + offset,
            null,  // value schema
            "value-" + offset
        ));

        return records;
    }

    @Override
    public void stop() {
        // Cleanup
    }
}
```

## Kafka Connect - Sink Connector

Sink connectors export data from Kafka to external systems. They receive records from assigned Kafka topic partitions.

```java
import org.apache.kafka.connect.sink.*;
import org.apache.kafka.common.config.ConfigDef;
import java.util.*;

public class SimpleSinkConnector extends SinkConnector {
    private Map<String, String> config;

    @Override
    public String version() {
        return "1.0.0";
    }

    @Override
    public void start(Map<String, String> props) {
        this.config = props;
    }

    @Override
    public Class<? extends Task> taskClass() {
        return SimpleSinkTask.class;
    }

    @Override
    public List<Map<String, String>> taskConfigs(int maxTasks) {
        List<Map<String, String>> configs = new ArrayList<>();
        for (int i = 0; i < maxTasks; i++) {
            configs.add(new HashMap<>(config));
        }
        return configs;
    }

    @Override
    public void stop() {
        // Cleanup
    }

    @Override
    public ConfigDef config() {
        return new ConfigDef()
            .define("output.file", ConfigDef.Type.STRING, ConfigDef.Importance.HIGH, "Output file path");
    }
}

// Sink Task implementation
class SimpleSinkTask extends SinkTask {
    private String outputFile;

    @Override
    public String version() {
        return "1.0.0";
    }

    @Override
    public void start(Map<String, String> props) {
        this.outputFile = props.get("output.file");
    }

    @Override
    public void put(Collection<SinkRecord> records) {
        for (SinkRecord record : records) {
            System.out.printf("Writing to %s: topic=%s, partition=%d, offset=%d, key=%s, value=%s%n",
                outputFile,
                record.topic(),
                record.kafkaPartition(),
                record.kafkaOffset(),
                record.key(),
                record.value());

            // Write to external system here
        }
    }

    @Override
    public void stop() {
        // Cleanup resources
    }
}
```

## CLI Tools - Topic Management

Kafka provides command-line tools for managing topics. The `kafka-topics.sh` script is used to create, list, describe, and delete topics.

```bash
# Start Kafka broker (KRaft mode)
KAFKA_CLUSTER_ID="$(./bin/kafka-storage.sh random-uuid)"
./bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/server.properties
./bin/kafka-server-start.sh config/server.properties

# Create a topic
./bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --create \
  --topic my-topic \
  --partitions 3 \
  --replication-factor 1 \
  --config retention.ms=604800000 \
  --config cleanup.policy=delete

# List all topics
./bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

# Describe a topic
./bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --describe --topic my-topic

# Output:
# Topic: my-topic    PartitionCount: 3    ReplicationFactor: 1
#     Topic: my-topic    Partition: 0    Leader: 0    Replicas: 0    Isr: 0
#     Topic: my-topic    Partition: 1    Leader: 0    Replicas: 0    Isr: 0
#     Topic: my-topic    Partition: 2    Leader: 0    Replicas: 0    Isr: 0

# Alter topic configuration
./bin/kafka-configs.sh --bootstrap-server localhost:9092 \
  --entity-type topics --entity-name my-topic \
  --alter --add-config retention.ms=86400000

# Increase partitions
./bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --alter --topic my-topic --partitions 6

# Delete a topic
./bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --delete --topic my-topic
```

## CLI Tools - Console Producer and Consumer

Console producer and consumer are useful for testing and debugging. They allow sending and receiving messages from the command line.

```bash
# Console producer - send messages interactively
./bin/kafka-console-producer.sh --bootstrap-server localhost:9092 \
  --topic my-topic \
  --property "key.separator=:" \
  --property "parse.key=true"
# Then type: key1:value1 <Enter>

# Producer with specific properties
./bin/kafka-console-producer.sh --bootstrap-server localhost:9092 \
  --topic my-topic \
  --producer-property acks=all \
  --producer-property linger.ms=10

# Console consumer - read messages
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic my-topic \
  --from-beginning

# Consumer with key printing
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic my-topic \
  --from-beginning \
  --property print.key=true \
  --property key.separator=":"

# Consumer in a consumer group
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic my-topic \
  --group my-consumer-group

# Output with timestamp and partition info
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
  --topic my-topic \
  --from-beginning \
  --property print.timestamp=true \
  --property print.key=true \
  --property print.partition=true
```

## CLI Tools - Consumer Group Management

The `kafka-consumer-groups.sh` tool manages consumer groups, allowing you to list groups, describe their state, and reset offsets.

```bash
# List all consumer groups
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list

# Describe a consumer group
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --describe --group my-consumer-group

# Output:
# GROUP           TOPIC       PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
# my-consumer-group my-topic  0          100             150             50
# my-consumer-group my-topic  1          200             200             0
# my-consumer-group my-topic  2          50              100             50

# Describe members of a consumer group
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --describe --group my-consumer-group --members

# Reset offsets to earliest (dry run)
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group my-consumer-group \
  --reset-offsets \
  --topic my-topic \
  --to-earliest \
  --dry-run

# Reset offsets to earliest (execute)
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group my-consumer-group \
  --reset-offsets \
  --topic my-topic \
  --to-earliest \
  --execute

# Reset offsets to specific offset
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group my-consumer-group \
  --reset-offsets \
  --topic my-topic:0 \
  --to-offset 100 \
  --execute

# Reset offsets to timestamp
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group my-consumer-group \
  --reset-offsets \
  --topic my-topic \
  --to-datetime "2024-01-01T00:00:00.000" \
  --execute

# Delete a consumer group
./bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --delete --group my-consumer-group
```

## Kafka Connect CLI

Kafka Connect can be run in standalone or distributed mode. The REST API is used for managing connectors in distributed mode.

```bash
# Start Connect in standalone mode
./bin/connect-standalone.sh config/connect-standalone.properties \
  config/connect-file-source.properties

# Start Connect in distributed mode
./bin/connect-distributed.sh config/connect-distributed.properties

# REST API - List connectors
curl -X GET http://localhost:8083/connectors

# Create a connector
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "file-source",
    "config": {
      "connector.class": "org.apache.kafka.connect.file.FileStreamSourceConnector",
      "tasks.max": "1",
      "file": "/tmp/input.txt",
      "topic": "connect-test"
    }
  }'

# Get connector status
curl -X GET http://localhost:8083/connectors/file-source/status

# Get connector configuration
curl -X GET http://localhost:8083/connectors/file-source/config

# Update connector configuration
curl -X PUT http://localhost:8083/connectors/file-source/config \
  -H "Content-Type: application/json" \
  -d '{
    "connector.class": "org.apache.kafka.connect.file.FileStreamSourceConnector",
    "tasks.max": "2",
    "file": "/tmp/input.txt",
    "topic": "connect-test"
  }'

# Pause a connector
curl -X PUT http://localhost:8083/connectors/file-source/pause

# Resume a connector
curl -X PUT http://localhost:8083/connectors/file-source/resume

# Restart a connector
curl -X POST http://localhost:8083/connectors/file-source/restart

# Delete a connector
curl -X DELETE http://localhost:8083/connectors/file-source

# List connector plugins
curl -X GET http://localhost:8083/connector-plugins
```

## Summary

Apache Kafka serves as a foundational platform for building real-time data pipelines and streaming applications. The Producer API enables high-throughput message publishing with configurable durability through acknowledgments and batching. The Consumer API provides flexible message consumption with support for consumer groups, manual offset management, and various delivery semantics. The Admin API offers comprehensive cluster management capabilities for topics, configurations, ACLs, and consumer groups.

Kafka Streams extends the platform with a powerful stream processing library that enables building stateful, fault-tolerant streaming applications using familiar collection-like operations. It supports windowed aggregations, stream-table joins, and exactly-once processing semantics. Kafka Connect simplifies data integration by providing a framework for building reusable source and sink connectors with automatic offset tracking and fault tolerance. Together, these components form a complete ecosystem for building event-driven architectures, enabling use cases ranging from log aggregation and metrics collection to complex event processing and real-time analytics. The rich CLI tools facilitate operations and debugging, while the REST APIs enable automation and integration with orchestration systems.
