FROM node:18

WORKDIR /app

COPY package*.json ./

COPY services/places/package*.json ./services/places/
COPY packages/shared ./packages/shared
COPY services/places ./services/places

RUN npm install

WORKDIR /app/services/places

EXPOSE 3001

CMD ["npm", "start"]