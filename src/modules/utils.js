const fs = require('fs');
const base64Img = require('base64-img');
const request = require('request');
const qs = require('querystring');
const config = require('../config');

exports.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
  return re.test(String(email).toLowerCase());
};

/**
 * third-party integration utils
 */
exports.checkApiKey = (apiKey) => {
  if(config.demoMode) return true;
  if(config.API_KEY === apiKey) return true;

  return false;
};

exports.getFrontendUrl = token => `${config.frontendBaseUrl}/?token=${token}`;

exports.getPassportInfoUrl = token => `${config.baseUrl}/user/passport/info/${token}`;

exports.getStatusInfoUrl = token => `${config.baseUrl}/user/info/${token}`;

exports.getBaseUrl = () => `${config.baseUrl}`;

// Make HTTP Request
exports.makeHttpRequest = (url, params) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: qs.stringify(params)
  };

  request.post(url, options);
};

/**
 * gridfs utils
 */
async function getInfoFromGrid(gfs, filename) {
  return new Promise((resolve, reject) => {
    gfs.files.findOne({ filename }, (err, file) => {
      if(err) reject(err);
      else resolve(file);
    });
  });
}

exports.getImageDataFromGrid = (gfs, filename) => (new Promise(async (resolve, reject) => {
  try {
    const info = await getInfoFromGrid(gfs, filename);
    const rstream = gfs.createReadStream(filename);
    const bufs = [];
    rstream.on('data', (chunk) => {
      bufs.push(chunk);
    })
      .on('error', () => {
        reject(new Error('Error'));
      })
      .on('end', () => { // done
        const fbuf = Buffer.concat(bufs);
        const File = `${info.metadata};base64,${fbuf.toString('base64')}`;
        resolve(File);
      });
  } catch(error) {
    reject(error);
  }
}));

function getImageExt(base64Data) {
  try {
    const contentType = base64Data.split(';')[0].split(':')[1];
    if(contentType === 'image/jpeg' || contentType === 'image/jpg') return 'jpg';
    if(contentType === 'image/gif') return 'gif';
    if(contentType === 'image/png') return 'png';

    return 'tiff';
  } catch(error) {
    return undefined;
  }
}
exports.getImageExt = getImageExt;

exports.saveImagetoGrid = (gfs, filename, base64Data) => {
  let metadata;
  try {
    metadata = base64Data.split(';')[0]; // eslint-disable-line
  } catch(error) {
    // console.log(error);
  }

  const filepath = base64Img.imgSync(base64Data, './uploads', filename);

  const writestream = gfs.createWriteStream({ filename, metadata });
  fs.createReadStream(filepath)
    .on('end', () => {
      fs.unlink(filepath, (err) => {
        if (err) console.log('unlink error: ', err); // eslint-disable-line
      });
    })
    .pipe(writestream);
};
