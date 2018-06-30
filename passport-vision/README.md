Install (from ubuntu16.04):

```
apt-get update && apt-get install -y software-properties-common && add-apt-repository -y ppa:alex-p/tesseract-ocr
apt-get update && apt-get install -y tesseract-ocr-all 
apt-get install redis-server
apt-get install python-pip
pip install PassportEye
```

for Demo app:
```
npm install bee-queue
npm install moment
node server.js
```

Test:

```
curl localhost:8888
```

call repeatedly to see queue operation
