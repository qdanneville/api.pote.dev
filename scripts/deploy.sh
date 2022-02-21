#!/bin/sh

ssh $SSH_USER@$SSH_SERVER << EOF
    cd ~/app/api
    pwd
    ls -la
    echo "docker login"
    docker login registry.gitlab.com -u $USERNAME -p $TOKEN
    docker pull $IMAGE:migrate
    docker pull $IMAGE:studio
    docker pull $IMAGE:nestjs
    docker-compose -f docker-compose.migrate.yml up -d
    docker-compose -f docker-compose.studio.yml up -d
    docker-compose -f docker-compose.yml up -d
EOF