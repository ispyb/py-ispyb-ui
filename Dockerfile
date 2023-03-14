FROM harbor.maxiv.lu.se/dockerhub/library/node:18-alpine as build-step

# set working directory
#RUN mkdir /usr/app
WORKDIR /usr/app
COPY . /usr/app/

# install and cache app dependencies
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json
RUN apk --no-cache add curl
RUN npm install -g npm
RUN npm install

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

ENV REACT_APP_ISPYB_ENV MAXIV

RUN npm run build --max-old-space-size=4096

# Deploy container.
FROM docker.io/nginxinc/nginx-unprivileged:1-alpine

COPY docker/config/default.conf /etc/nginx/conf.d/

COPY --from=build-step /usr/app/build/ /usr/share/nginx/html/

# FROM harbor.maxiv.lu.se/dockerhub/library/node:19-alpine as build-step

# WORKDIR /usr/app
# COPY . /usr/app
# RUN apk --no-cache add curl
# RUN npm install

# ENV REACT_APP_ISPYB_ENV MAXIV


# EXPOSE 3000
# CMD ["npm", "start"]

