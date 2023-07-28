echo "************************"
echo "Transpiling rails app..."

export API_HOST=http://localhost:3000
export WORKSPACE=$(pwd)

cd "${WORKSPACE}"

echo "Generate .env"
sed -e "s#%API_HOST%#${API_HOST}#" .env.example >.env.production

echo "yarn install"
yarn install

echo "yarn build"
yarn build:production

echo "************************"
echo "Copying to rails app..."

cp -r $WORKSPACE/build/* $WORKSPACE/../back/public
