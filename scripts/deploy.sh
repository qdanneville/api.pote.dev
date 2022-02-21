#!/bin/sh

ssh $SSH_USER@$SSH_SERVER << EOF
    cd ~/app/api
    pwd
    ls -la
    echo "docker login"
    docker login registry.gitlab.com -u $USERNAME -p $TOKEN
    docker-compose -f docker-compose.migrate.yml down --remove-orphans
    docker pull $IMAGE:migrate
    docker-compose -f docker-compose.studio.yml down --remove-orphans
    docker pull $IMAGE:studio
    docker-compose -f docker-compose.yml down --remove-orphans
    docker pull $IMAGE:nestjs
    docker-compose -f docker-compose.nginx.yml pull
    docker-compose -f docker-compose.nginx.yml up -d
    docker-compose -f docker-compose.migrate.yml up -d
    docker-compose -f docker-compose.studio.yml up -d
    docker-compose -f docker-compose.yml up -d
EOF