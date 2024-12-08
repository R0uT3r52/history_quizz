FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retries 5

RUN npm install
#RUN npm install --network-timeout 1000000 --fetch-retries 5

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 