FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run security:audit
RUN npm run build

ENV PORT=4000

ENV CRYPT_SALT=some
ENV JWT_SECRET_KEY=jwt_key
ENV JWT_SECRET_REFRESH_KEY=jwt_sec_key
ENV TOKEN_EXPIRE_TIME=10h
ENV TOKEN_REFRESH_EXPIRE_TIME=20h

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=home_library
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5800

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]