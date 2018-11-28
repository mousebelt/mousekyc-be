### Config Setting

```
git clone https://github.com/norestlabs/mousekyc-be.git
cd mousekyc-be

cp config/development.js.bak config/development.js
cp config/development.js.bak config/development.js
cp config/production.js.bak config/production.js
cp config/test.js.bak config/test.js
```
- config file update (development.js, production.js, test.js)  
- update `.env`  

### Install and Run

- Prerequisites
nodejs
mongodb

- run server
```
npm install
npm start
```
or
```
npm install
pm2 start src/app.js -n mousekyc-backend
```

- restart server
```
pm2 restart mousekyc-backend
```

### Install and Run using Docker
- Prerequisites
docker
docker-compose

- Installation and Run
```
docker build
docker-compose up
```

- run test secnario
`docker-compose -f docker-compose.test.yml up`

test `curl -i http://localhost:3000/global/countries`

### Documentation
[**API Docs**](https://github.com/norestlabs/mousekyc-be/wiki) can be found inside the repo wiki.
