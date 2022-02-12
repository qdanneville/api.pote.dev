#!/bin/sh

ssh $SSH_USER@$SSH_SERVER << 'ENDSSH'
    cd ~/app/api
    ls -la
    echo "printing username"
    echo $USERNAME
    echo "printing token"
    echo $TOKEN
    echo "docker login"
    docker login registry.gitlab.com -u $USERNAME -p $TOKEN
    echo "pulling nestjs image"
    docker pull $IMAGE:nestjs
    echo "pulling nginx image"
    echo "docker login"
    docker pull $IMAGE:nginx
    docker-compose -f docker-compose.yml up -d --build
ENDSSH