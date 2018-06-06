FROM node
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install --global express
COPY . /app
EXPOSE 3000
CMD ["npm", "start"]