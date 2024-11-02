FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript

COPY . .

RUN npm install

RUN npm run build

ENV PORT=5000
ENV DB_NAME=sql12742088
ENV DB_USER=sql12742088
ENV DB_PASSWORD=xDW4P8uvdv
ENV DB_PORT=3306
ENV DB_HOST=sql12.freesqldatabase.com
ENV DB_DIALECT=mysql
ENV SESSION_SECRET=Very-secret-key
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379
ENV FRONTEND_URL=http://localhost:5173

EXPOSE 3000

CMD ["node", "--experimental-modules" , "dist/server.js"]