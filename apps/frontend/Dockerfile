FROM node:18

WORKDIR /app

COPY apps/frontend/package*.json ./apps/frontend/

WORKDIR /app/apps/frontend

RUN npm install

COPY apps/frontend .

EXPOSE 5173

CMD ["npm","run","dev","--","--host"]