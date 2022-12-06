# specify node version and image
FROM node:18.12.1 AS development

# specify working docker container
WORKDIR /diza/src/app

# Copy package from host to inside container working directory
COPY package*.json ./

# Install packages inside container
RUN npm install

# Bundle app sources
COPY . .

RUN npm run build

EXPOSE 3000

################
## PRODUCTION ##
################
# Build another image
FROM node:18.12.1 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /diza/src/app

COPY --from=development /diza/src/app .
EXPOSE 3000

#run app
CMD ['node', 'dist/main']
