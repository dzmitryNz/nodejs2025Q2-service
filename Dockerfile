FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run security:audit
RUN npm run build

ENV PORT=4000

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]