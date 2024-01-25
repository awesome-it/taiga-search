FROM node:21-alpine as base
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

FROM base as dev
EXPOSE 5173
CMD [ "npm", "run", "dev" ]

FROM base as prod
RUN npm run build
EXPOSE 5173
CMD [ "npm", "run", "preview" ]
