FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

ENV PORT=5001

EXPOSE 5001

CMD ["node", "--experimental-modules" , "dist/server.js"]