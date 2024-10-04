FROM node:20.17.0

WORKDIR /renthub-backend

COPY package*.json ./

RUN npm install -g nodemon || true
RUN npm install -g yarn || true
RUN npm install -g knex || true

RUN yarn install

RUN mkdir -p /var/lib/mysql-files \
&& chown -R node:node /var/lib/mysql-files \
&& chmod 755 /var/lib/mysql-files

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
