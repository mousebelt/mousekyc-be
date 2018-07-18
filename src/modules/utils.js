const fs = require("fs");
const base64Img = require("base64-img");
const request = require('request');
const qs = require('querystring');
const config = require("../config");

exports.validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * third-party integration utils
 */
exports.checkApiKey = apiKey => {
  if (config.demoMode) return true;
  if (config.API_KEY == apiKey) return true;

  return false;
};

exports.getFrontendUrl = token => {
  return `${config.frontendBaseUrl}/?token=${token}`;
};

exports.getPassportInfoUrl = token => {
  return `${config.baseUrl}/user/passport/info/${token}`;
};

exports.getStatusInfoUrl = token => {
  return `${config.baseUrl}/user/info/${token}`;
};

exports.getBaseUrl = () => {
  return `${config.baseUrl}`;
};

// Make HTTP Request
exports.makeHttpRequest = (url, params) => {
  const options = {
    'method': 'POST',
    'headers': {
      'content-type': 'application/x-www-form-urlencoded'
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
    gfs.files.findOne({ filename }, function (err, file) {
      if (err) reject(err);
      else resolve(file);
    });
  });
}

exports.getImageDataFromGrid = async (gfs, filename) => {
  try {
    info = await getInfoFromGrid(gfs, filename);

    return new Promise((resolve, reject) => {
      var rstream = gfs.createReadStream(filename);
      var bufs = [];
      rstream.on('data', function (chunk) {
        bufs.push(chunk);
      })
        .on('error', function () {
          reject(new Error('Error'));
        })
        .on('end', function () { // done
          var fbuf = Buffer.concat(bufs);
          var File = `${info.metadata};base64,` + (fbuf.toString('base64'));
          resolve(File);
        });
    });
  } catch (error) {
    reject(error);
  }
}

function getImageExt(base64_data) {
  try {
    var contentType = base64_data.split(";")[0].split(":")[1]
    if (contentType == "image/jpeg" || contentType == "image/jpg") return 'jpg';
    else if (contentType == "image/gif") return 'gif';
    else if (contentType == "image/png") return 'png';
    else return 'tiff';
  } catch (error) {
    return undefined;
  }
}
exports.getImageExt = getImageExt;

exports.saveImagetoGrid = (gfs, filename, base64_data) => {
  var metadata
  try {
    metadata = base64_data.split(";")[0];
  } catch (error) { }

  var filepath = base64Img.imgSync(base64_data, "./uploads", filename);

  var writestream = gfs.createWriteStream({ filename, metadata: metadata });
  fs.createReadStream(filepath)
    .on("end", function () {
      fs.unlink(filepath, function (err) {
        if (err) console.log("unlink error: ", err);
      });
    })
    .pipe(writestream);
}
