# 1. Base Image - Using slim version reduces image size (~150MB smaller)
FROM openjdk:17-jdk-slim

# 2. Set a working directory (best practice)
WORKDIR /app

# 3. Copy the JAR file (using wildcard makes it version-independent)
COPY target/delivery-microservice-*.jar app.jar

# 4. Expose the application port (matches your server.port)
EXPOSE 8093

# 5. Run the application (exec form is preferred for ENTRYPOINT)
ENTRYPOINT ["java", "-jar", "app.jar"]