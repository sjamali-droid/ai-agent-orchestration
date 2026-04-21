# Elasticsearch

> **Used by**: DevSecOps, QA
> **What to paste**: index API, search/query DSL, mapping types, index templates, ILM policies, common Lucene query syntax.
> **Source**: https://www.elastic.co/guide/en/elasticsearch/reference/current/

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Elasticsearch

Elasticsearch is a distributed search and analytics engine, scalable data store, and vector database optimized for speed and relevance on production-scale workloads. It serves as the foundation of Elastic's open Stack platform, enabling near real-time search over massive datasets, vector searches for AI applications, full-text search, log analytics, metrics monitoring, and application performance monitoring (APM). The engine is built on Apache Lucene and provides a RESTful API for indexing, searching, and managing data across distributed clusters.

Elasticsearch supports a wide range of use cases including Retrieval Augmented Generation (RAG) for generative AI, semantic and vector search, hybrid search combining lexical and semantic approaches, observability solutions for logs and metrics, and security information and event management (SIEM). The platform can be deployed via Elastic Cloud as a managed service, self-hosted using Docker or native packages, or run locally for development using the `start-local` script that sets up both Elasticsearch and Kibana in Docker containers.

## Run Elasticsearch Locally

Quick setup for local development using Docker with the start-local script.

```bash
# Download and run the start-local script
curl -fsSL https://elastic.co/start-local | sh

# After installation, access services at:
# Elasticsearch: http://localhost:9200
# Kibana: http://localhost:5601

# Load environment variables and test connection
cd elastic-start-local
source .env
curl $ES_LOCAL_URL -H "Authorization: ApiKey ${ES_LOCAL_API_KEY}"

# Alternative: use basic auth with elastic user
curl -u elastic:$ES_LOCAL_PASSWORD http://localhost:9200
```

## Index Documents

Add documents to an index using the REST API. Elasticsearch automatically creates the index if it doesn't exist.

```bash
# Index a single document with explicit ID
curl -X POST "localhost:9200/customer/_doc/1" \
  -H "Content-Type: application/json" \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "firstname": "Jennifer",
    "lastname": "Walters",
    "email": "jennifer@example.com"
  }'

# Response:
# {
#   "_index": "customer",
#   "_id": "1",
#   "_version": 1,
#   "result": "created",
#   "_shards": {"total": 2, "successful": 1, "failed": 0},
#   "_seq_no": 0,
#   "_primary_term": 1
# }

# Retrieve the document
curl -X GET "localhost:9200/customer/_doc/1" \
  -u elastic:$ES_LOCAL_PASSWORD

# Bulk index multiple documents (NDJSON format)
curl -X PUT "localhost:9200/customer/_bulk" \
  -H "Content-Type: application/x-ndjson" \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '
{ "create": { } }
{ "firstname": "Monica", "lastname": "Rambeau" }
{ "create": { } }
{ "firstname": "Carol", "lastname": "Danvers" }
{ "create": { } }
{ "firstname": "Wanda", "lastname": "Maximoff" }
'
```

## Match Query

Full-text search query that analyzes the provided text before matching against indexed documents.

```bash
# Basic match query
curl -X GET "localhost:9200/customer/_search" \
  -H "Content-Type: application/json" \
  -u elastic:$ES_LOCAL_PASSWORD \
  -d '{
    "query": {
      "match": {
        "firstname": "Jennifer"
      }
    }
  }'

# Match query with options
curl -X GET "localhost:9200/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match": {
        "message": {
          "query": "this is a test",
          "operator": "and",
          "fuzziness": "AUTO",
          "prefix_length": 2
        }
      }
    }
  }'

# Response:
# {
#   "hits": {
#     "total": { "value": 1, "relation": "eq" },
#     "max_score": 1.0,
#     "hits": [
#       {
#         "_index": "customer",
#         "_id": "1",
#         "_score": 1.0,
#         "_source": { "firstname": "Jennifer", "lastname": "Walters" }
#       }
#     ]
#   }
# }
```

## Boolean Query

Combine multiple queries using boolean logic with must, should, must_not, and filter clauses.

```bash
curl -X POST "localhost:9200/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "bool": {
        "must": {
          "term": { "user.id": "kimchy" }
        },
        "filter": {
          "term": { "tags": "production" }
        },
        "must_not": {
          "range": {
            "age": { "gte": 10, "lte": 20 }
          }
        },
        "should": [
          { "term": { "tags": "env1" } },
          { "term": { "tags": "deployed" } }
        ],
        "minimum_should_match": 1,
        "boost": 1.0
      }
    }
  }'

# Nested bool queries for complex logic
curl -X GET "localhost:9200/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "bool": {
        "must": [
          {
            "bool": {
              "should": [
                { "match": { "user.id": "kimchy" }},
                { "match": { "user.id": "banon" }}
              ]
            }
          },
          { "match": { "tags": "production" }}
        ]
      }
    }
  }'
```

## Dense Vector Fields and kNN Search

Store and search dense vectors for semantic search and AI applications using k-nearest neighbor algorithms.

```bash
# Create index with dense_vector field
curl -X PUT "localhost:9200/my-index" \
  -H "Content-Type: application/json" \
  -d '{
    "mappings": {
      "properties": {
        "my_vector": {
          "type": "dense_vector",
          "dims": 3,
          "similarity": "cosine",
          "index_options": {
            "type": "int8_hnsw"
          }
        },
        "my_text": {
          "type": "keyword"
        }
      }
    }
  }'

# Index documents with vectors
curl -X PUT "localhost:9200/my-index/_doc/1" \
  -H "Content-Type: application/json" \
  -d '{
    "my_text": "text1",
    "my_vector": [0.5, 10, 6]
  }'

curl -X PUT "localhost:9200/my-index/_doc/2" \
  -H "Content-Type: application/json" \
  -d '{
    "my_text": "text2",
    "my_vector": [-0.5, 10, 10]
  }'

# Perform kNN search
curl -X POST "localhost:9200/my-index/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "knn": {
      "field": "my_vector",
      "query_vector": [0.3, 9, 7],
      "k": 10,
      "num_candidates": 100
    }
  }'
```

## Aggregations - Metrics

Compute statistics from field values including averages, sums, min, max, and cardinality.

```bash
# Average aggregation
curl -X POST "localhost:9200/exams/_search?size=0" \
  -H "Content-Type: application/json" \
  -d '{
    "aggs": {
      "avg_grade": { "avg": { "field": "grade" } }
    }
  }'

# Response:
# {
#   "aggregations": {
#     "avg_grade": {
#       "value": 75.0
#     }
#   }
# }

# Multiple metric aggregations
curl -X POST "localhost:9200/sales/_search?size=0" \
  -H "Content-Type: application/json" \
  -d '{
    "aggs": {
      "total_sales": { "sum": { "field": "price" } },
      "avg_price": { "avg": { "field": "price" } },
      "max_price": { "max": { "field": "price" } },
      "min_price": { "min": { "field": "price" } },
      "unique_customers": { "cardinality": { "field": "customer_id" } }
    }
  }'

# Average with runtime field for computed values
curl -X POST "localhost:9200/exams/_search?size=0" \
  -H "Content-Type: application/json" \
  -d '{
    "runtime_mappings": {
      "grade.corrected": {
        "type": "double",
        "script": {
          "source": "emit(Math.min(100, doc['"'"'grade'"'"'].value * params.correction))",
          "params": { "correction": 1.2 }
        }
      }
    },
    "aggs": {
      "avg_corrected_grade": {
        "avg": { "field": "grade.corrected" }
      }
    }
  }'
```

## Aggregations - Buckets

Group documents into buckets based on field values, ranges, or date intervals.

```bash
# Terms aggregation - group by unique values
curl -X GET "localhost:9200/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "aggs": {
      "genres": {
        "terms": { "field": "genre" }
      }
    }
  }'

# Response:
# {
#   "aggregations": {
#     "genres": {
#       "doc_count_error_upper_bound": 0,
#       "sum_other_doc_count": 0,
#       "buckets": [
#         { "key": "electronic", "doc_count": 6 },
#         { "key": "rock", "doc_count": 3 },
#         { "key": "jazz", "doc_count": 2 }
#       ]
#     }
#   }
# }

# Date histogram aggregation
curl -X POST "localhost:9200/logs/_search?size=0" \
  -H "Content-Type: application/json" \
  -d '{
    "aggs": {
      "logs_per_day": {
        "date_histogram": {
          "field": "@timestamp",
          "calendar_interval": "day"
        }
      }
    }
  }'

# Nested aggregations - terms with sub-aggregations
curl -X GET "localhost:9200/sales/_search?size=0" \
  -H "Content-Type: application/json" \
  -d '{
    "aggs": {
      "by_category": {
        "terms": { "field": "category" },
        "aggs": {
          "avg_price": { "avg": { "field": "price" } },
          "total_sales": { "sum": { "field": "price" } }
        }
      }
    }
  }'
```

## Index Management

Create, configure, and manage indices with custom mappings and settings.

```bash
# Create index with explicit mappings
curl -X PUT "localhost:9200/my-index" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "title": { "type": "text" },
        "status": { "type": "keyword" },
        "created_at": { "type": "date" },
        "price": { "type": "float" },
        "tags": { "type": "keyword" }
      }
    }
  }'

# Get index mapping
curl -X GET "localhost:9200/my-index/_mapping"

# Update index settings
curl -X PUT "localhost:9200/my-index/_settings" \
  -H "Content-Type: application/json" \
  -d '{
    "index": {
      "number_of_replicas": 2
    }
  }'

# Delete index
curl -X DELETE "localhost:9200/my-index"

# Check if index exists
curl -I "localhost:9200/my-index"
```

## Java Low-Level REST Client

Connect to Elasticsearch from Java applications using the official low-level REST client.

```java
import org.apache.http.HttpHost;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;

// Initialize the client
RestClient restClient = RestClient.builder(
    new HttpHost("localhost", 9200, "http"),
    new HttpHost("localhost", 9201, "http")
).build();

// Synchronous request
Request request = new Request("GET", "/");
Response response = restClient.performRequest(request);
String responseBody = EntityUtils.toString(response.getEntity());
int statusCode = response.getStatusLine().getStatusCode();

// Request with JSON body
Request indexRequest = new Request("PUT", "/posts/_doc/1");
indexRequest.setJsonEntity("{\"title\":\"Hello World\",\"content\":\"My first post\"}");
Response indexResponse = restClient.performRequest(indexRequest);

// Asynchronous request with callback
Request searchRequest = new Request("GET", "/posts/_search");
restClient.performRequestAsync(searchRequest, new ResponseListener() {
    @Override
    public void onSuccess(Response response) {
        System.out.println("Search completed: " + response.getStatusLine());
    }

    @Override
    public void onFailure(Exception exception) {
        System.err.println("Search failed: " + exception.getMessage());
    }
});

// Configure timeouts
RestClientBuilder builder = RestClient.builder(new HttpHost("localhost", 9200))
    .setRequestConfigCallback(requestConfigBuilder ->
        requestConfigBuilder
            .setConnectTimeout(5000)
            .setSocketTimeout(60000)
    );

// Close client when done
restClient.close();
```

## Java Client with Authentication

Configure the REST client with authentication and SSL for secure connections.

```java
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.SSLContexts;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;

import javax.net.ssl.SSLContext;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;

// Basic authentication
final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
credentialsProvider.setCredentials(AuthScope.ANY,
    new UsernamePasswordCredentials("elastic", "password"));

RestClient restClient = RestClient.builder(
    new HttpHost("localhost", 9200, "https"))
    .setHttpClientConfigCallback(httpClientBuilder ->
        httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider)
    ).build();

// SSL with certificate
Path caCertificatePath = Paths.get("/path/to/ca.crt");
CertificateFactory factory = CertificateFactory.getInstance("X.509");
Certificate trustedCa;
try (InputStream is = Files.newInputStream(caCertificatePath)) {
    trustedCa = factory.generateCertificate(is);
}

KeyStore trustStore = KeyStore.getInstance("pkcs12");
trustStore.load(null, null);
trustStore.setCertificateEntry("ca", trustedCa);

SSLContext sslContext = SSLContexts.custom()
    .loadTrustMaterial(trustStore, null)
    .build();

RestClient secureClient = RestClient.builder(
    new HttpHost("localhost", 9200, "https"))
    .setHttpClientConfigCallback(httpClientBuilder ->
        httpClientBuilder
            .setSSLContext(sslContext)
            .setDefaultCredentialsProvider(credentialsProvider)
    ).build();
```

## Python Client Connection

Connect to Elasticsearch from Python applications using the official client library.

```python
import os
from elasticsearch import Elasticsearch

# Basic connection with password
username = 'elastic'
password = os.getenv('ES_LOCAL_PASSWORD')

client = Elasticsearch(
    "http://localhost:9200",
    basic_auth=(username, password)
)

# Test connection
print(client.info())

# Index a document
doc = {
    "title": "Hello Elasticsearch",
    "content": "This is my first document",
    "timestamp": "2024-01-15T10:00:00"
}
response = client.index(index="my-index", id=1, document=doc)
print(f"Indexed with result: {response['result']}")

# Search documents
query = {
    "query": {
        "match": {
            "content": "first document"
        }
    }
}
results = client.search(index="my-index", body=query)
for hit in results['hits']['hits']:
    print(f"Found: {hit['_source']['title']}")

# Bulk indexing
from elasticsearch.helpers import bulk

actions = [
    {"_index": "my-index", "_source": {"title": f"Doc {i}", "value": i}}
    for i in range(100)
]
success, failed = bulk(client, actions)
print(f"Indexed {success} documents, {failed} failures")

# Connection with API key
client_with_apikey = Elasticsearch(
    "http://localhost:9200",
    api_key=os.getenv('ES_LOCAL_API_KEY')
)
```

## Update and Delete Documents

Modify existing documents or remove them from indices.

```bash
# Update document by ID
curl -X POST "localhost:9200/customer/_update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "doc": {
      "email": "jennifer.walters@example.com",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  }'

# Update with script
curl -X POST "localhost:9200/products/_update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "script": {
      "source": "ctx._source.price += params.increase",
      "params": { "increase": 5 }
    }
  }'

# Upsert - update or insert if not exists
curl -X POST "localhost:9200/products/_update/2" \
  -H "Content-Type: application/json" \
  -d '{
    "doc": { "name": "New Product", "price": 99.99 },
    "doc_as_upsert": true
  }'

# Update by query
curl -X POST "localhost:9200/products/_update_by_query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "term": { "status": "pending" }
    },
    "script": {
      "source": "ctx._source.status = '"'"'processed'"'"'"
    }
  }'

# Delete document by ID
curl -X DELETE "localhost:9200/customer/_doc/1"

# Delete by query
curl -X POST "localhost:9200/logs/_delete_by_query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "range": {
        "@timestamp": { "lt": "2024-01-01" }
      }
    }
  }'
```

## Cluster Health and Info

Monitor cluster status and retrieve system information.

```bash
# Cluster health
curl -X GET "localhost:9200/_cluster/health?pretty"

# Response:
# {
#   "cluster_name": "elasticsearch",
#   "status": "green",
#   "timed_out": false,
#   "number_of_nodes": 1,
#   "number_of_data_nodes": 1,
#   "active_primary_shards": 5,
#   "active_shards": 5,
#   "relocating_shards": 0,
#   "initializing_shards": 0,
#   "unassigned_shards": 0
# }

# Cluster stats
curl -X GET "localhost:9200/_cluster/stats?pretty"

# Node info
curl -X GET "localhost:9200/_nodes?pretty"

# Index stats
curl -X GET "localhost:9200/my-index/_stats?pretty"

# Cat APIs for human-readable output
curl -X GET "localhost:9200/_cat/indices?v"
curl -X GET "localhost:9200/_cat/nodes?v"
curl -X GET "localhost:9200/_cat/shards?v"
curl -X GET "localhost:9200/_cat/health?v"
```

Elasticsearch provides a comprehensive platform for building search and analytics solutions at any scale. The REST API enables straightforward integration with any programming language, while official client libraries for Java, Python, JavaScript, Go, and other languages provide idiomatic interfaces for common operations. The query DSL offers powerful full-text search capabilities with support for fuzzy matching, phrase queries, and boolean combinations, while the aggregation framework enables complex analytics including metrics calculations, bucketing, and pipeline aggregations.

For production deployments, Elasticsearch supports horizontal scaling through sharding and replication, with automatic cluster management and failover. The platform integrates seamlessly with the broader Elastic Stack including Kibana for visualization, Logstash and Beats for data ingestion, and machine learning features for anomaly detection and forecasting. Vector search capabilities with dense_vector fields enable modern AI applications including semantic search and RAG systems, making Elasticsearch a versatile foundation for both traditional search use cases and cutting-edge AI-powered applications.
