FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript

COPY . .

RUN npm install

RUN npm run build

ENV PORT=5001

EXPOSE 3000

CMD ["node", "--experimental-modules" , "dist/server.js"]