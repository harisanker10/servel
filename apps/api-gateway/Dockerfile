FROM node:alpine
RUN npm install pnpm -g
WORKDIR /app

COPY ../../pnpm*.yaml .
COPY . ./apps/api-gateway
COPY ./packages/* ./packages/
RUN pnpm install
RUN cd apps/api-gateway
RUN ls
RUN pnpm run build
CMD ["pnpm","run","dev"]
