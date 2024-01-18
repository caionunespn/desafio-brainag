FROM node:18 AS builder

WORKDIR /usr/src/api

ENV NODE_ENV PRODUCTION

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install
RUN yarn global add dotenv-cli

COPY . .

RUN yarn build

FROM node:18

COPY --from=builder /usr/src/api/node_modules ./node_modules
COPY --from=builder /usr/src/api/package*.json ./
COPY --from=builder /usr/src/api/dist ./dist
COPY --from=builder /usr/src/api/prisma ./prisma

EXPOSE 4005

RUN yarn seed:start

CMD [ "yarn", "migrate:start" ]
