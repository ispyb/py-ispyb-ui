FROM harbor.maxiv.lu.se/dockerhub/library/node:18-bullseye-slim as build-step

#RUN apk --no-cache add curl
RUN apt-get -y update; apt-get -y install curl

# set working directory
#RUN mkdir /usr/app
WORKDIR /usr/app
#COPY ./public /usr/app/public
#COPY ./src /usr/app/src
COPY ./ /usr/app/

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# install and cache app dependencies
#COPY package.json /usr/app/package.json
#COPY package-lock.json /usr/app/package-lock.json
RUN npm install -g npm
RUN npm install

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

ENV REACT_APP_ISPYB_ENV MAXIV
EXPOSE 3000
CMD ["npm", "start"]


#RUN npm run build --max-old-space-size=4096
#
# Deploy container.
#FROM docker.io/nginxinc/nginx-unprivileged:1-alpine
#
#COPY docker/config/default.conf /etc/nginx/conf.d/
#
#COPY --from=build-step /usr/app/build/ /usr/share/nginx/html/

