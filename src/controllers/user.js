const uuidv1 = require("uuid/v1");
const passport = require("passport");
const base64Img = require("base64-img");
const fs = require("fs");

const config = require("../config");
var UserModel = require("../models/user");
const UtilsModule = require("../modules/utils");
const MailService = require("../services/mail.service");

exports.getInfoToken = async (req, res) => {
  var token = req.params.token;

  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });

  var user = await UserModel.findOne({ token });
  if (!user) return res.json({ status: 400, msg: "token is not valid !" });

  return res.json({
    status: 200,
    msg: "success",
    data: {
      email: user.email,
      token,
      approvalStatus: user.approvalStatus,
      approvalDescription: user.approvalDescription
    }
  });
};

exports.postGenToken = async (req, res, next) => {
  var email = String(req.body.email).toLowerCase();
  var apiKey = String(req.body.apiKey);

  if (!UtilsModule.checkApiKey(apiKey))
    return res.json({ status: 400, msg: "Invalid API Key !" });

  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });

  UserModel.findOne({ email }, (err, user) => {
    if (err)
      return res.json({
        status: 400,
        msg: "DB error !"
      });

    if (!user) {
      var token = uuidv1(); // '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
      var callbackUrl = `${config.FRONTEND_URL}/?token=${token}`;
      var tokenExpire = Date.now() + 24 * 3600 * 60;
      user = new UserModel({ email, token, tokenExpire });
      user.save(err => {
        if (err)
          return res.json({
            status: 400,
            msg: "User save error !"
          });

        return res.json({
          status: 200,
          msg: "success",
          data: {
            token,
            callbackUrl
          }
        });
      });
    } else {
      var token = user.token;
      var callbackUrl = `${config.FRONTEND_URL}/?token=${token}`;
      return res.json({
        status: 200,
        msg: "success",
        data: {
          token,
          callbackUrl
        }
      });
    }
  });
};

/**
 * @function: Update user from token
 *
 * @method: POST /update
 *
 * @param {String|Required} token
 *
 * @param {String} firstname
 * @param {String} lastname
 * @param {String} dob
 * @param {String} documentExpireDate
 * @param {String} nationalityCountry
 * @param {String} documentId
 *
 * @param {String} phone
 * @param {String} residenceCountry
 * @param {String} residenceAddress
 *
 * @param {String} adminContact
 * @param {String} adminMessage
 * @param {String} backgroundCheckId
 *
 * @return
 * { "status": 200, "msg": "success", data: userInfo }
 */
exports.postUpdate = async (req, res) => {
  const gfs = req.app.get("gfs");
  var {
    token,
    //
    firstname,
    lastname,
    dob,
    documentExpireDate,
    nationalityCountry,
    documentId,
    //
    phone,
    residenceCountry,
    residenceAddress,
    //
    adminContact,
    adminMessage,
    backgroundCheckId
  } = req.body;

  // validation
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  var userRow = await UserModel.findOne({ token });
  if (!userRow) return res.json({ status: 400, msg: "token is not valid !" });

  // logic
  try {
    if (userRow.approvalStatus == "BLOCKED")
      return res.json({ status: 400, msg: "status is blocked !" });
    if (userRow.approvalStatus == "APPROVED")
      return res.json({ status: 400, msg: "status is approved !" });

    // Add user
    userRow.set({
      firstname: firstname || userRow.firstname,
      lastname: lastname || userRow.lastname,
      //
      dob: dob || userRow.dob,
      documentExpireDate: documentExpireDate || userRow.documentExpireDate,
      nationalityCountry: nationalityCountry || userRow.nationalityCountry,
      documentId: documentId || userRow.documentId,
      //
      phone: phone || userRow.phone,
      residenceCountry: residenceCountry || userRow.residenceCountry,
      residenceAddress: residenceAddress || userRow.residenceAddress,
      //
      adminContact: adminContact || userRow.adminContact,
      // checkStatus: checkStatus || userRow.checkStatus,
      adminMessage: adminMessage || userRow.adminMessage,
      backgroundCheckId: backgroundCheckId || userRow.backgroundCheckId
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success" });
    });
  } catch (error) {
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};

/**
 * @function: Update user identity document from token, email
 *
 * @method: POST /update/identity
 *
 * @param {String|Required} token
 * @param {String|Required} documentType
 * @param {String|Required} identityDocument
 *
 * @returns { status: 200, msg: "success", data: userRow }
 */
exports.postUpdateIdentity = async (req, res) => {
  const gfs = req.app.get("gfs");
  var { token, documentType, identityDocument } = req.body;

  // validation
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  var userRow = await UserModel.findOne({ token });
  if (!userRow) return res.json({ status: 400, msg: "token is not valid !" });

  if (!documentType || documentType == "")
    return res.json({ status: 400, msg: "Empty document type !" });
  if (!identityDocument || identityDocument == "")
    return res.json({ status: 400, msg: "Empty identity document !" });

  try {
    if (userRow.approvalStatus == "BLOCKED")
      return res.json({ status: 400, msg: "status is blocked !" });

    // save file
    var filename = `identityDocument-${Date.now()}.${UtilsModule.getImageExt(
      identityDocument
    )}`;
    UtilsModule.saveImagetoGrid(gfs, filename, identityDocument);
    // Add user
    userRow.set({
      documentType,
      identityDocument: filename
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};

/**
 * @function: Update user selfie from token
 *
 * @method: POST /update/selfie
 *
 * @param {String|Required} token
 * @param {String|Required} selfie
 *
 * @returns { status: 200, msg: "success", data: userRow }
 */
exports.postUpdateSelfie = async (req, res) => {
  const gfs = req.app.get("gfs");
  var { token, selfie } = req.body;

  // validation
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  var userRow = await UserModel.findOne({ token });
  if (!userRow) return res.json({ status: 400, msg: "token is not valid !" });

  if (!selfie || selfie == "")
    return res.json({ status: 400, msg: "Empty selfie !" });

  try {
    if (userRow.approvalStatus == "BLOCKED")
      return res.json({ status: 400, msg: "status is blocked !" });

    // save file
    var filename = `selfie-${Date.now()}`;
    filename = `${filename}.${UtilsModule.getImageExt(selfie)}`;
    UtilsModule.saveImagetoGrid(gfs, filename, selfie);
    // Add user
    userRow.set({
      selfie: filename,
      approvalStatus: "PENDING",
      approvalDescription: undefined
    });

    userRow.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !", data: err });
      }
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};
