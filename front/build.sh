echo "************************"
echo "Transpiling rails app..."

export API_HOST=http://164.92.227.60/
export WS_HOST=ws://164.92.227.60/
export DEPLOY_HOST=164.92.227.60
export DEPLOY_USER=irpia
export WORKSPACE=$(pwd)


cd "${WORKSPACE}"

echo "Generate .env"
sed -e "s#%API_HOST%#${API_HOST}#" -e "s#%WS_HOST%#${WS_HOST}#" .env.example > .env.production

echo "yarn install"
yarn install

echo "yarn build"
yarn build:production

echo "************************"
echo "Transfering rails app..."

echo "scp -r $WORKSPACE/build/* ${DEPLOY_USER}@${DEPLOY_HOST}:/home/${DEPLOY_USER}/api/current/public"
scp -r $WORKSPACE/build/* ${DEPLOY_USER}@${DEPLOY_HOST}:/home/${DEPLOY_USER}/api/shared/public
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "chgrp -R www-data /home/${DEPLOY_USER}/api/shared"