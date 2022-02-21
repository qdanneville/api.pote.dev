#!/bin/sh

ssh $SSH_USER@$SSH_SERVER << EOF
    cd ~/app/api
    ls -la
    echo "printing username"
    echo $USERNAME
    echo "printing token"
    echo $TOKEN
    echo "docker login"
    docker login registry.gitlab.com -u $USERNAME -p $TOKEN
    echo "pulling migrate image"
    echo $IMAGE:migrate
    docker pull $IMAGE:migrate
    echo "pulling studio image"
    echo $IMAGE:studio
    docker pull $IMAGE:studio
    echo "pulling nestjs image"
    echo $IMAGE:nestjs
    docker pull $IMAGE:nestjs
    docker-compose -f docker-compose.yml up -d --build
EOF