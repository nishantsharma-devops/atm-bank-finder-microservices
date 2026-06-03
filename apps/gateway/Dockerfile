FROM node:18

WORKDIR /app

COPY package*.json ./

COPY apps/gateway/package*.json ./apps/gateway/
COPY packages/shared ./packages/shared
COPY apps/gateway ./apps/gateway

RUN npm install

WORKDIR /app/apps/gateway

EXPOSE 3000

CMD ["npm", "start"]