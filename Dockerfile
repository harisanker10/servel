FROM node:alpine AS base
RUN npm install pnpm -g
WORKDIR /app
COPY ./packages ./packages
COPY ./pnpm*.yaml ./
COPY ./package.json ./
COPY ./turbo.json ./
RUN pnpm install

# FROM base AS api-gateway
# COPY ./pnpm*.yaml ./package.json ./turbo.json ./.turbo ./
# COPY ./apps/api-gateway ./apps/api-gateway/
# COPY ./packages/ ./packages/
# RUN pnpm install
# RUN pnpm run build
# CMD ["pnpm","run","dev"]

FROM base as request-service
WORKDIR /app/apps/request-service
COPY ./apps/request-service/package.json ./apps/request-service/nest-cli.json ./
RUN pnpm install
COPY ./apps/request-service/ ./
CMD ["pnpm", "run", "dev"]

FROM base as build-service
RUN apk add buildctl
RUN apk add git
WORKDIR /app/apps/build-service
COPY ./apps/build-service/package.json ./apps/build-service/nest-cli.json ./
RUN pnpm install
COPY ./apps/build-service/ ./
CMD ["pnpm", "run", "dev"]

FROM base as projects-service
WORKDIR /app/apps/projects
COPY ./apps/projects/package.json ./apps/projects/nest-cli.json ./
RUN pnpm install
COPY ./apps/projects/ ./
CMD ["pnpm", "run", "dev"]
