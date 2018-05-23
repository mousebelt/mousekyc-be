# docker build for backend service
```
docker build -t kyc-app:0.1 .
docker run -p 3000:3000 -ti kyc-app:0.1
```

# docker-compose and Build the mongo dependency
> docker-compose up

# test
> curl -i http://localhost:3000/
