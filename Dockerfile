#Stage 0
FROM node:11.12.0-alpine as build-env

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

#Stage 1
FROM nginx:1.15.9-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-env /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]