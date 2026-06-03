FROM node:18

WORKDIR /app

COPY package*.json ./

COPY services/realtime/package*.json ./services/realtime/
COPY packages/shared ./packages/shared
COPY services/realtime ./services/realtime

RUN npm install

WORKDIR /app/services/realtime

EXPOSE 3003

CMD ["npm", "start"]