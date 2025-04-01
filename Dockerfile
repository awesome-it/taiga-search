FROM node:23.10-alpine as base

ARG VITE_TAIGA_BASE_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENTID

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
