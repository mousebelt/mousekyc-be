# docker build
> docker build -t kyc-app:0.1 .

# docker run
> docker run -p 3000:3000 -ti kyc-app:0.1

# test
> curl -i http://localhost:3000/

# docker-compose and Build the mongo dependency
> docker-compose up