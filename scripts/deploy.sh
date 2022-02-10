#!/bin/sh

ssh $SSH_USER@$SSH_SERVER << 'ENDSSH'
    cd ~/app/api
    docker login registry.gitlab.com -u $USERNAME -p $TOKEN
    docker pull $IMAGE:nestjs
    docker pull $IMAGE:nginx
    docker-compose -f docker-compose.yml up -d --build
ENDSSH