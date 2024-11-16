FROM node:20.18.0-alpine as stage

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build:prod

FROM nginx:stable-alpine

COPY --from=stage /app/dist/frontend/browser /var/www/bookexchangeplatform.com

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
