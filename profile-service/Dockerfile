FROM openjdk:17
EXPOSE 8091
ADD target/profile-service-0.0.1-SNAPSHOT.jar profile-service.jar
ENTRYPOINT ["java","-jar","profile-service.jar"]