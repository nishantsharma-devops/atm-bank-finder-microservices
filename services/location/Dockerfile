FROM node:18

WORKDIR /app

COPY package*.json ./

COPY services/location/package*.json ./services/location/
COPY packages/shared ./packages/shared
COPY services/location ./services/location

RUN npm install

WORKDIR /app/services/location

EXPOSE 3002

CMD ["npm", "start"]