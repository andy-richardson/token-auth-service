FROM node:argon
MAINTAINER Andy Richardson

ENV NODE_ENV production
ENV PORT 80

EXPOSE 80

RUN npm install -g npm

WORKDIR /var/auth

CMD npm install && node bin/www
