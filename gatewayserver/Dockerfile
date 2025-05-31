# Dockerfile
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY target/*.jar app.jar
RUN apk add --no-cache curl
ENTRYPOINT ["java","-jar","/app.jar"]