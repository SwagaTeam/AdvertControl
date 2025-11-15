FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /app

# Копируем package.json и package-lock.json для npm install
COPY package*.json ./

RUN npm install react-loading && npm install

# Копируем всё остальное
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
