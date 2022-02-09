echo POSTGRES_IMAGE=$IMAGE:postgres  >> .env
echo REDIS_IMAGE=$IMAGE:redis  >> .env
echo NESTJS_IMAGE=$IMAGE:nestjs  >> .env
echo NGINX_IMAGE=$IMAGE:nginx >> .env

echo APP_BASE_URL=$APP_BASE_URL  >> .env

echo POSTGRES_USER=$POSTGRES_USER  >> .env
echo POSTGRES_PASSWORD=$POSTGRES_PASSWORD  >> .env
echo POSTGRES_DB=$POSTGRES_DB  >> .env
echo DB_HOST=$DB_HOST  >> .env
echo DB_PORT=$DB_PORT  >> .env
echo DB_SCHEMA=$DB_SCHEMA  >> .env

echo DATABASE_URL=$DATABASE_URL  >> .env

echo PORT=$PORT  >> .env

echo JWT_SECRET=$JWT_SECRET  >> .env
echo JWT_EXPIRE_IN=$JWT_EXPIRE_IN  >> .env
echo JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET  >> .env
echo JWT_REFRESH_IN=$JWT_REFRESH_IN  >> .env

echo JWT_OAUTH_SECRET=$JWT_OAUTH_SECRET  >> .env
echo JWT_OAUTH_TOKEN_PREFIX=$JWT_OAUTH_TOKEN_PREFIX  >> .env

echo CSRF_SECRET=$CSRF_SECRET  >> .env

echo REDIS_HOST=$REDIS_HOST  >> .env
echo REDIS_PORT=$REDIS_PORT  >> .env
echo REDIS_DB=$REDIS_DB  >> .env
echo REDIS_PASSWORD=$REDIS_PASSWORD  >> .env

echo MAIL_HOST=$MAIL_HOST  >> .env
echo MAIL_USERNAME=$MAIL_USERNAME  >> .env
echo MAIL_PASSWORD=$MAIL_PASSWORD  >> .env

echo FORGOT_PASSWORD_PREFIX=$FORGOT_PASSWORD_PREFIX  >> .env
echo FORGOT_PASSWORD_TOKEN_EXPIRES_IN=$FORGOT_PASSWORD_TOKEN_EXPIRES_IN  >> .env

echo VERIFY_EMAIL_PREFIX=$VERIFY_EMAIL_PREFIX  >> .env
echo VERIFFY_EMAIL_TOKEN_EXPIRES_IN=$VERIFFY_EMAIL_TOKEN_EXPIRES_IN  >> .env

echo GITHUB_GET_ACCESS_TOKEN_URI=$GITHUB_GET_ACCESS_TOKEN_URI  >> .env
echo GITHUB_GET_USER_URI=$GITHUB_GET_USER_URI  >> .env
echo GITHUB_GET_USER_EMAIL_URI=$GITHUB_GET_USER_EMAIL_URI  >> .env
echo GITHUB_ID=$GITHUB_ID  >> .env
echo GITHUB_SECRET=$GITHUB_SECRET  >> .env
echo GITHUB_SCOPE=$GITHUB_SCOPE  >> .env
echo OAUTH_REDIRECT_URI=$OAUTH_REDIRECT_URI  >> .env
echo NOTION_CONTENT_API=$NOTION_CONTENT_API  >> .env
echo NOTION_VERSION_PREFIX=$NOTION_VERSION_PREFIX  >> .env
echo NOTION_VERSION=$NOTION_VERSION  >> .env
echo NOTION_SPLITBEE_CONTENT_API=$NOTION_SPLITBEE_CONTENT_API  >> .env
echo NOTION_SECRET=$NOTION_SECRET  >> .env
echo NOTION_TOKEN=$NOTION_TOKEN  >> .env

echo NOTION_FORMATIONS_DATABASE_ID=$NOTION_FORMATIONS_DATABASE_ID  >> .env
echo NOTION_COURSES_DATABASE_ID=$NOTION_COURSES_DATABASE_ID  >> .env
echo NOTION_CHAPTERS_DATABASE_ID=$NOTION_CHAPTERS_DATABASE_ID  >> .env
echo NOTION_TAGS_DATABASE_ID=$NOTION_TAGS_DATABASE_ID  >> .env
echo NOTION_DIFFICULTIES_DATABASE_ID=$NOTION_DIFFICULTIES_DATABASE_ID  >> .env
echo NOTION_PREREQUISITES_DATABASE_ID=$NOTION_PREREQUISITES_DATABASE_ID  >> .env
echo NOTION_TECHNOLOGIES_DATABASE_ID=$NOTION_TECHNOLOGIES_DATABASE_ID  >> .env
