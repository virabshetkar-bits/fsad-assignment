FROM node:20.18.0-alpine as stage

WORKDIR /app

COPY ./package.json .

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20.18.0-alpine as deployed

ENV NODE_ENV=production

WORKDIR /app

COPY --from=stage /app/package.json .

RUN npm i

COPY --from=stage /app/dist ./dist
COPY --from=stage /app/prisma ./prisma
COPY --from=stage /app/public ./public

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]