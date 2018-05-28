const cryptoRandomString = require('crypto-random-string');
const fs = require("fs");
const config = require('../config');
var UserModel = require("../models/user");
var UtilsModule = require("../modules/utils");
const MailService = require('../services/mail.service');

exports.getStatus = async (req, res) => {
  var token = String(req.params.token);

  try {
    var userRow = await UserModel.findOne({ token });
    if (!userRow) return res.json({ status: 200, msg: "No existing user", data: undefined });

    return res.json({ status: 200, msg: "success", data: userRow.approvalStatus });
  } catch (error) {
    return res.json({ status: 400, msg: "User read error !", data: error });
  }
}

exports.postStatus = async (req, res) => {
  var email = String(req.body.email);

  if (!UtilsModule.validateEmail(email)) return res.json({ status: 400, msg: "Invalid email !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (!userRow) return res.json({ status: 200, msg: "No existing user", data: undefined });

    return res.json({ status: 200, msg: "success", data: userRow.approvalStatus });
  } catch (error) {
    return res.json({ status: 400, msg: "User read error !", data: error });
  }
}

exports.postGenToken = async (req, res) => {
  var email = String(req.body.email);
  if (!UtilsModule.validateEmail(email)) return res.json({ status: 400, msg: "Invalid email !" });

  var token = cryptoRandomString(17);

  var userRow = await UserModel.findOne({ email });
  if (!userRow) userRow = new UserModel({ email });
  userRow.set({ token });
  userRow.save();

  res.json({status: 200, msg: 'success', data: token});
}

exports.postAdd = async (req, res) => {
  const gfs = req.app.get("gfs");
  var {
    name,
    email,
    phone,
    dob,
    nationalityCountry,
    residenceCountry,
    residenceAddress,
    adminContact,
    checkStatus,
    adminMessage,
    backgroundCheckId
  } = req.body;

  let identityDocument, selfie;
  try {
    identityDocument = req.files.identityDocument;
    selfie = req.files.selfie;
  } catch (err) {
    console.log(err);
  }

  // validation
  if (!name || name == "")
    return res.json({ status: 400, msg: "Empty name !" });
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!phone || phone == "")
    return res.json({ status: 400, msg: "Empty phone !" });
  if (!dob || dob == "") return res.json({ status: 400, msg: "Empty dob !" });
  if (!nationalityCountry || nationalityCountry == "")
    return res.json({ status: 400, msg: "Empty nationalityCountry !" });
  if (!residenceCountry || residenceCountry == "")
    return res.json({ status: 400, msg: "Empty residenceCountry !" });
  if (!residenceAddress || residenceAddress == "")
    return res.json({ status: 400, msg: "Empty residenceAddress !" });
  if (!adminContact || adminContact == "")
    return res.json({ status: 400, msg: "Empty adminContact !" });
  if (!adminMessage || adminMessage == "")
    return res.json({ status: 400, msg: "Empty adminMessage !" });
  if (!backgroundCheckId || backgroundCheckId == "")
    return res.json({ status: 400, msg: "Empty backgroundCheckId !" });
  if (!identityDocument)
    return res.json({ status: 400, msg: "Empty identityDocument !" });
  if (!selfie) return res.json({ status: 400, msg: "Empty selfie !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (userRow)
      return res.json({ status: 400, msg: "Already existing user !" });

    // Save identityDocument to gfs
    var identityDocumentDbFile = undefined;
    try {
      var filename =
        `identityDocument` +
        "-" +
        Date.now() +
        "." +
        identityDocument.name.split(".")[
        identityDocument.name.split(".").length - 1
        ];
      var filepath = "./uploads/" + filename;
      var err = await identityDocument.mv(filepath);
      if (!err && fs.existsSync(filepath)) {
        var writestream = gfs.createWriteStream({ filename });
        fs
          .createReadStream(filepath)
          // .on("end", function() {
          //   fs.unlink(filepath, function(err) {
          //     if (err) console.log("unlink error: ", err);
          //   });
          // })
          .pipe(writestream);
        identityDocumentDbFile = filename;
      }
    } catch (error) {
      console.log(error);
    }

    // Save selfie to gfs
    var selfieDbFile = undefined;
    try {
      var filename =
        `selfie` +
        "-" +
        Date.now() +
        "." +
        selfie.name.split(".")[selfie.name.split(".").length - 1];
      var filepath = "./uploads/" + filename;
      var err = await identityDocument.mv(filepath);
      if (!err && fs.existsSync(filepath)) {
        writestream = gfs.createWriteStream({ filename });
        fs
          .createReadStream(filepath)
          // .on("end", function() {
          //   fs.unlink(filepath, function(err) {
          //     if (err) console.log("unlink error: ", err);
          //   });
          // })
          .pipe(writestream);
        selfieDbFile = filename;
      }
    } catch (error) {
      console.log(error);
    }

    // Add user
    userRow = new UserModel({
      name,
      email,
      phone,
      dob,
      nationalityCountry,
      residenceCountry,
      residenceAddress,
      identityDocument: identityDocumentDbFile,
      selfie: selfieDbFile,
      adminContact,
      checkStatus,
      adminMessage,
      backgroundCheckId
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};

exports.postUpdate = async (req, res) => {
  const gfs = req.app.get("gfs");
  var {
    name,
    email,
    phone,
    dob,
    nationalityCountry,
    residenceCountry,
    residenceAddress,
    adminContact,
    checkStatus,
    adminMessage,
    backgroundCheckId
  } = req.body;

  let identityDocument, selfie;
  try {
    identityDocument = req.files.identityDocument;
    selfie = req.files.selfie;
  } catch (errors) { }

  // validation
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (!userRow) return res.json({ status: 400, msg: "No existing user !" });

    // Save identityDocument to gfs
    var identityDocumentDbFile = undefined;
    if (identityDocument) {
      var filename =
        `identityDocument` +
        "-" +
        Date.now() +
        "." +
        identityDocument.name.split(".")[
        identityDocument.name.split(".").length - 1
        ];
      var filepath = "./uploads/" + filename;
      var err = await identityDocument.mv(filepath);

      if (!err && fs.existsSync(filepath)) {
        try {
          var writestream = gfs.createWriteStream({ filename });
          fs
            .createReadStream(filepath)
            // .on("end", function() {
            //   fs.unlink(filepath, function(err) {
            //     if (err) console.log("unlink error: ", err);
            //   });
            // })
            .pipe(writestream);
          identityDocumentDbFile = filename;
        } catch (error) { }
      }
    }

    // Save selfie to gfs
    var selfieDbFile = undefined;
    if (selfie) {
      var filename =
        `selfie` +
        "-" +
        Date.now() +
        "." +
        selfie.name.split(".")[selfie.name.split(".").length - 1];
      var filepath = "./uploads/" + filename;
      var err = await selfie.mv(filepath);

      if (!err && fs.existsSync(filepath)) {
        try {
          var writestream = gfs.createWriteStream({ filename });
          fs
            .createReadStream(filepath)
            // .on("end", function() {
            //   fs.unlink(filepath, function(err) {
            //     if (err) console.log("unlink error: ", err);
            //   });
            // })
            .pipe(writestream);
          selfieDbFile = filename;
        } catch (error) { }
      }
    }

    // Add user
    userRow.set({
      name: name || userRow.name,
      email: email || userRow.email,
      phone: phone || userRow.phone,
      dob: dob || userRow.dob,
      nationalityCountry: nationalityCountry || userRow.nationalityCountry,
      residenceCountry: residenceCountry || userRow.residenceCountry,
      residenceAddress: residenceAddress || userRow.residenceAddress,
      identityDocument: identityDocumentDbFile || userRow.identityDocument,
      selfie: selfieDbFile || userRow.selfie,
      adminContact: adminContact || userRow.adminContact,
      checkStatus: checkStatus || userRow.checkStatus,
      adminMessage: adminMessage || userRow.adminMessage,
      backgroundCheckId: backgroundCheckId || userRow.backgroundCheckId
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};
