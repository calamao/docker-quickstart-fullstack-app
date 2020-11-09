#################
# Build the app #
#################
FROM node:12-alpine as build
WORKDIR /app
COPY HMI.UI/package.json .
COPY HMI.UI/package-lock.json .
COPY HMI.UI/src/lib/abb/abb-common-ux-angular-9-0.8.1.tgz ./src/lib/abb/
RUN npm install
# @angular/cli is already installed as a dependency
# RUN npm install -g @angular/cli@10.1.2
COPY HMI.UI/ .
RUN npm run build:prod

################
# Run in NGINX #
################
FROM nginx:alpine
EXPOSE 80
EXPOSE 443
COPY --from=build /app/dist /usr/share/nginx/html

# default value in case it's not defined
ENV API_URL=/

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]