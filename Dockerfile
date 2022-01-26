FROM node:alpine

ENV NODE_ENV production

COPY . /py-ispyb-ui
WORKDIR /py-ispyb-ui

RUN apk --no-cache add git curl \
  && npm install \
  && npm install -g serve

EXPOSE 5000

ENTRYPOINT ["/bin/sh", "/py-ispyb-ui/entrypoint"]
CMD ["serve", "-s", "build"]

HEALTHCHECK --start-period=90s --timeout=5s --retries=1 CMD /py-ispyb-ui/healthcheck

