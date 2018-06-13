const fs = require("fs");
const base64Img = require("base64-img");

exports.validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.getImageDataFromGrid = async (gfs, filename) => {
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
        var File = (fbuf.toString('base64'));
        resolve(File);
      });
  });
}

exports.getImageExt = (contentType) => {
  if (contentType == "image/jpeg" || contentType == "image/jpg") return 'jpg';
  else if (contentType == "image/gif") return 'gif';
  else if (contentType == "image/png") return 'png';
  else return 'tiff';
}

exports.saveImagetoGrid = (gfs, filename, data, contentType = undefined) => {
  var filepath = base64Img.imgSync(data, "./uploads", filename);

  var writestream = gfs.createWriteStream({ filename });
  fs.createReadStream(filepath)
    .on("end", function () {
      fs.unlink(filepath, function (err) {
        if (err) console.log("unlink error: ", err);
      });
    })
    .pipe(writestream);
}
