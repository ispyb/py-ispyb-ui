FROM harbor.maxiv.lu.se/dockerhub/library/node:19-alpine as build-step
WORKDIR /usr/app
COPY . /usr/app
RUN apk --no-cache add curl
RUN npm install

ENV REACT_APP_ISPYB_ENV MAXIV


EXPOSE 3000
CMD ["npm", "start"]

