FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

FROM node:22-alpine
ARG SERVICE_NAME=auth-service
ENV SERVICE_NAME=${SERVICE_NAME}
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist/ dist/
EXPOSE 3001 3002 3003 3004 3005
CMD node dist/${SERVICE_NAME}/index.js
