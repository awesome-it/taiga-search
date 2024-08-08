FROM node:21-alpine as base
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

FROM base as dev
EXPOSE 5173
CMD [ "npm", "run", "dev" ]

FROM base as prod-builder
RUN npm run build

FROM nginx:1-alpine as prod
COPY --from=prod-builder /usr/src/app/dist/ /html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
