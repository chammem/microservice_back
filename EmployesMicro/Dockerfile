FROM openjdk:17
WORKDIR /app

# copy the exact built JAR and name it 'app.jar'
COPY target/EmployesMicro-0.0.1-SNAPSHOT.jar app.jar

# expose your internal port
EXPOSE 8098

# run it
ENTRYPOINT ["java","-jar","app.jar"]
