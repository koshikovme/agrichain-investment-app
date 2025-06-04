#!/bin/bash

read -p "Нажми Enter, чтобы запустить configserver..."
kitty --hold bash -c "cd configserver && ./mvnw spring-boot:run" &

read -p "Нажми Enter, чтобы запустить eurekaserver..."
kitty --hold bash -c "cd eurekaserver && ./mvnw spring-boot:run" &

# Подождать, чтобы они успели подняться (если хочешь — можешь убрать)
read -p "Нажми Enter, чтобы запустить user & investments..."
# Запуск остальных сервисов параллельно
kitty --hold bash -c "cd investments && ./mvnw spring-boot:run" &
kitty --hold bash -c "cd users && ./mvnw spring-boot:run" &

read -p "Нажми Enter, чтобы запустить gateway..."
kitty --hold bash -c "cd gatewayserver && ./mvnw spring-boot:run" &

