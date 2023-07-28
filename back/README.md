# IRPIA

"Indexation de ressources pédagogiques intelligente et assistée"
"Smart assisted indexing of educational resources"

## Installation

### Docker (recommended)

#### Structure

Irpia uses 5 docker containers :

- irpia-redis, a raw redis server
- irpia-fuseki, a fuseki server preloaded with scolomfr vocabularies
- irpia-algos, a set of ML tasks under providing smart suggestions
- irpia-jobs, the async job runner of Irpia web app
- Irpia web, the React+Rails web app

Only the last one has to be built locally, the others are available on Docker Hub.

#### Steps

**Prerequisites :**

We assume that you have a debian/ubuntu server with git, curl, docker and docker-compose installed. If not done, add your user to the docker group :

```bash
sudo usermod -aG docker $USER
```

1. Clone this repository

```bash
git clone -b dockerize https://github.com/irplab/irpia.git
```

2. Customize and build the front-end application

```bash
cd irpia/front 
```

Adapt the API_HOST constant in `front/docker-build.sh` to your needs, then build the front-end application.
If you only want to test the application on localhost, you can leave the file as is.

If you don't have the javascript node/npm/yarn environment installed, use the following commands or follow another
approach (nvm, ...). All the lines require root privileges.

```bash
apt update
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
chmod +x nodesource_setup.sh && ./nodesource_setup.sh
apt-get install -y nodejs
npm install --global yarn
```

Then, build the front-end application :

```bash
./docker-build.sh
```

You know have the `irpia/back/public` folder filled with the static files of the front-end application.

3. Build the irpia-web image

From irpia/back folder, build the irpia-web image :

```bash
 docker image build --tag irpia-web:v0 .
```

4. Run the docker-compose file

All the other images are available on Docker Hub. So you can directly run the docker-compose file after customizing some
environment variables.

```yaml
# customize !
- CORS_HOST='localhost:3000'
- SECRET_KEY_BASE=your-secret-key-base
- SIRENE_KEY=your-sirene-api-key
- SIRENE_SECRET=your-sirene-api-secret
```

Fill CORS_HOST with the host of your application accordingly to what you did at step 2.

To obtain a Rails secret key base, you can use the following command : `openssl rand -hex 64`

To apply for a Sirene API key and secret, go to https://api.insee.fr, declare your application and follow the instructions.

Then, you are done ! You can run the docker-compose file :

```bash
docker-compose up -d
#or
docker compose up -d
```
