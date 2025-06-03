#!/bin/bash

set -e

for service in configserver eurekaserver gatewayserver investments users
do
  echo "Building $service..."
  (cd "$service" && sh ./mvnw clean package -DskipTests)
done

echo "All services built successfully."