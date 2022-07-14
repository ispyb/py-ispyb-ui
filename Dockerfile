FROM node:16-alpine

ENV NODE_ENV production

COPY . /py-ispyb-ui
WORKDIR /py-ispyb-ui

COPY package*.json ./

RUN apk --no-cache add git curl \
  && npm install \
  && npm install -g serve

COPY . ./

EXPOSE 3000 5000

ENTRYPOINT ["/bin/sh", "/py-ispyb-ui/entrypoint"]
CMD ["serve", "-s", "build"]

#HEALTHCHECK --start-period=90s --timeout=5s --retries=1 CMD /py-ispyb-ui/healthcheck
HEALTHCHECK --start-period=90s --timeout=5s --retries=1 CMD curl -f http://localhost:3000/ || exit 1

