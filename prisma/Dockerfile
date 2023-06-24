FROM node:16-alpine

RUN apk add --no-cache git

RUN echo $DATABASE_URL

WORKDIR /app

#COPY package.json yarn.lock ./
COPY . ./prisma/

#RUN yarn install --frozen-lockfile
RUN npx prisma generate

#RUN apt update
#RUN apt --assume-yes install postgresql-client

CMD npx prisma migrate deploy