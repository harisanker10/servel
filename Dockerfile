FROM node:alpine AS base
RUN npm install pnpm -g

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install

FROM build AS api-gateway
WORKDIR /usr/src/app/apps/api-gateway/
RUN pnpm run build
EXPOSE 3001
CMD ["pnpm","run","start:prod"]

FROM build AS users
WORKDIR /usr/src/app/apps/api-gateway/
RUN pnpm run build
EXPOSE 3001
CMD ["pnpm","run","start:prod"]

# FROM build AS api-gateway
# WORKDIR /usr/src/app/apps/api-gateway/
# RUN pnpm run build
# EXPOSE 3001
# CMD ["pnpm","run","start:prod"]
