echo "************************"
echo "Generatig production .env"

export CELERY_BROKER=redis://irpia-redis:6379/0
export CELERY_BACKEND=redis://irpia-redis:6379/1
export REDIS_URL=redis://irpia-redis:6379/2
export CORS_HOST=http://localhost:3000/
export WORKSPACE=$(pwd)

cd "${WORKSPACE}"

echo ".env.production generated"
sed -e "s#%REDIS_URL%#${REDIS_URL}#" -e "s#%CORS_HOST%#${CORS_HOST}#" -e "s#%CELERY_BROKER%#${CELERY_BROKER}#" -e "s#%CELERY_BACKEND%#${CELERY_BACKEND}#" .env.example >.env.production
