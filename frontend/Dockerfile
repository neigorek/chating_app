# Stage 1 build
FROM node:18.12.1 AS development

WORKDIR /diza/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@15.0.2

COPY . .

RUN npm run build

EXPOSE 4200
EXPOSE 49153
