# Base on offical NGINX Alpine image
FROM nginx:alpine

#To be able to read env variable
RUN apk add --no-cache nginx-mod-http-perl

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf.template /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]