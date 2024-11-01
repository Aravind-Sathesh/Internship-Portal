FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript

COPY . .

RUN npm install

RUN npm run build

ENV JWT_SECRET=Very-Strong-JWT-Key
ENV GOOGLE_CLIENT_ID=893672255262-o3qidnug2rstjqt6gcrm72cbt80ddh4e.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV DB_NAME=sql12742088
ENV DB_USER=sql12742088
ENV DB_PASSWORD=xDW4P8uvdv
ENV DB_PORT=3306
ENV DB_HOST=sql12.freesqldatabase.com
ENV DB_DIALECT=mysql
ENV SESSION_SECRET=your-secret-key

EXPOSE 3000

CMD ["node", "--experimental-modules" , "dist/server.js"]