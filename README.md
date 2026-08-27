# AgriChain Investment App

AgriChain is a multi-service investment platform for agriculture. The repository combines a Spring Boot backend, a React frontend, a Go notification service, and a Go-based payment integration with PayPal and Solana flows.

## Architecture

The platform is split into several services:

- `configserver`: Spring Cloud Config Server.
- `eurekaserver`: service discovery with Netflix Eureka.
- `gatewayserver`: API gateway and JWT resource server.
- `users`: user profile and account management service.
- `investments`: investment lot and payment-facing business logic.
- `frontend`: React application for the user interface.
- `notification-service`: Go service for notifications over HTTP, WebSocket, gRPC, and Kafka.
- `paypal-solana-service`: Go payment service for PayPal and Solana workflows.

## Repository Layout

```text
.
|-- configserver/
|-- docker-deploy/
|-- eurekaserver/
|-- frontend/
|-- gatewayserver/
|-- investments/
|-- notification-service/
|-- paypal-solana-service/
|-- users/
|-- build.sh
`-- run.sh
```

## Main Features

- Spring Boot microservice architecture with config server, service discovery, and gateway routing.
- JWT-based authentication with Keycloak.
- Investment lot publishing and investment workflows.
- Transactions view in the frontend.
- Multi-language UI with Russian, Kazakh, and English translations.
- WebSocket and Kafka-backed notifications.
- PayPal and Solana payment flows.
- Dockerized deployment for local integration testing.

## Tech Stack

- Java + Spring Boot + Spring Cloud
- React + TypeScript + Redux Toolkit + Material UI
- Go for notifications and payment services
- Kafka
- PostgreSQL
- Docker and Docker Compose
- Keycloak

## Prerequisites

Install the tools needed for the parts of the system you want to run:

- Java
- Node.js and npm
- Docker and Docker Compose
- Go

The Java services use the Maven Wrapper (`./mvnw`), so a separate Maven installation is optional.

## Running the Platform

### Option 1: Local Spring Boot startup

Build the Java services:

```bash
./build.sh
```

Start the main Spring services one by one:

```bash
./run.sh
```

`run.sh` opens separate `kitty` terminals for:

- `configserver`
- `eurekaserver`
- `investments`
- `users`
- `gatewayserver`

Start the frontend separately:

```bash
cd frontend
npm install
npm start
```

### Option 2: Docker Compose

Bring up the integrated stack:

```bash
cd docker-deploy
docker compose up --build
```

This compose setup includes the core application services plus infrastructure such as Keycloak, Kafka, PostgreSQL, the notification service, and the payment API.

## Default Ports

The main ports configured in `docker-deploy/docker-compose.yml` are:

- `3000`: frontend
- `8072`: gateway server
- `8071`: config server
- `8070`: Eureka server
- `8060`: users service
- `8090`: investments service
- `8080`: Keycloak
- `8081`: notification HTTP endpoint
- `50051`: payment API gRPC endpoint
- `5433`: PostgreSQL mapped port

## Frontend Environment Variables

The frontend uses these environment variables:

- `REACT_APP_KEYCLOAK_URL`
- `REACT_APP_GATEWAY_USERS_URL`
- `REACT_APP_GATEWAY_INVESTMENTS_URL`

The Docker Compose configuration already provides defaults for local development.

## Useful Paths

- Frontend app entry: `frontend/src/App.tsx`
- Compose stack: `docker-deploy/docker-compose.yml`
- Notification service entry: `notification-service/cmd/notification/main.go`
- Payment service entry: `paypal-solana-service/cmd/api/main.go`

## Notes

- Some services rely on external credentials and local environment setup for full end-to-end execution.
- The repository contains both Java and Go services, so full local setup is broader than a standard Spring Boot project.
