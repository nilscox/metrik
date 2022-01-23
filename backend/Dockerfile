FROM node:14-slim AS build

ENV NODE_ENV production

WORKDIR /build/backend

COPY backend/package.json backend/yarn.lock ./
RUN yarn --production=false --frozen-lockfile

COPY backend ./
COPY dtos ../dtos
RUN yarn build

FROM node:14-alpine AS runtime

WORKDIR /app

COPY backend/package.json backend/yarn.lock ./
RUN yarn --production; yarn cache clean

COPY --from=build /build/backend/dist ./

CMD ["node", "backend/src/main.js"]
