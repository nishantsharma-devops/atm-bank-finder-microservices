FROM node:18

WORKDIR /app

COPY package*.json ./

COPY services/auth/package*.json ./services/auth/
COPY packages/shared ./packages/shared
COPY services/auth ./services/auth

RUN npm install

WORKDIR /app/services/auth

EXPOSE 3004

CMD ["npm", "start"]
