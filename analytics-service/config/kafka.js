// config/kafka.js
module.exports = {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'analytics-service',
    connectionTimeout: parseInt(process.env.KAFKA_CONN_TIMEOUT) || 10000,
    retry: {
      initialRetryTime: parseInt(process.env.KAFKA_RETRY_INITIAL) || 3000,
      retries: parseInt(process.env.KAFKA_RETRY_ATTEMPTS) || 10,
      maxRetryTime: parseInt(process.env.KAFKA_RETRY_MAX) || 30000
    }
  };