FROM node:20-alpine3.20

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --quiet
RUN apk add --no-cache tzdata

COPY . .
RUN npm run build

CMD ["npm", "run", "start:prod"]
