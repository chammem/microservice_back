// src/config/eureka-client.js
const Eureka = require('eureka-js-client').Eureka;

module.exports = new Eureka({
  instance: {
    app: 'analytics-service',
    instanceId: `analytics-service:${process.env.PORT || 3000}`,
    hostName: process.env.HOST_IP || 'analytics-service',
    ipAddr: process.env.HOST_IP || 'analytics-service',
    port: {
      '$': parseInt(process.env.PORT) || 3000,
      '@enabled': true
    },
    vipAddress: 'analytics-service',
    statusPageUrl: `http://${process.env.HOST_IP}:${process.env.PORT || 3000}/info`,
    healthCheckUrl: `http://${process.env.HOST_IP}:${process.env.PORT || 3000}/health`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    },
    leaseInfo: {
      renewalIntervalInSecs: 5,
      durationInSecs: 15
    }
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'discovery-service',
    port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
    fetchRegistry: false
  }
});