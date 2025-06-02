# Dockerfile
FROM node:18-alpine
WORKDIR /app

# Установить необходимые пакеты для сборки нативных модулей
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]