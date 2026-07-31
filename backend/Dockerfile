# Étape 1 : Build de l'application avec Maven
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY . .
# Ajout des droits d'exécution sur le mvnw
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Étape 2 : Exécution de l'application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]