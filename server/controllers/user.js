const base64Img = require("base64-img");
const cryptoRandomString = require("crypto-random-string");
const fs = require("fs");
const config = require("../config");
var UserModel = require("../models/user");
var UtilsModule = require("../modules/utils");
const MailService = require("../services/mail.service");

/**
 * @function: Get user info from token
 *
 * @method: GET /info/:token
 *
 * @param {String|Required} token
 *
 * @return
 * { "status": 200, "msg": "success", data: userInfo }
 *
 * userInfo = {
 *  email, token, approvalStatus, approvalDescriptin
 * }
 */
exports.getInfoToken = async (req, res) => {
  var token = String(req.params.token);

  try {
    var userRow = await UserModel.findOne({ token });
    if (!userRow) return res.json({ status: 400, msg: "Invalid token !" });

    return res.json({
      status: 200,
      msg: "success",
      data: {
        email: userRow.email,
        token,
        approvalStatus: userRow.approvalStatus,
        approvalDescription: userRow.approvalDescription
      }
    });
  } catch (error) {
    return res.json({ status: 400, msg: "User read error !", data: error });
  }
};

/**
 * @function: Generate token for user email
 *
 * @method: POST /gentoken
 *
 * @param {String|Required} email
 *
 * @return
 * { "status": 200, "msg": "success", data: { token, email } }
 */
exports.postGenToken = async (req, res) => {
  var email = String(req.body.email);
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });

  var token = cryptoRandomString(13) + String(Date.now());
  var tokenExpireDate = Date.now() + 3600 * 1000;

  var userRow = await UserModel.findOne({ email });
  if (!userRow) userRow = new UserModel({ email });
  userRow.set({ token, tokenExpireDate });
  userRow.save();

  return res.json({ status: 200, msg: "success", data: { token, email } });
};

/**
 * @function: Update user from token, email
 *
 * @method: POST /update
 *
 * @param {String|Required} email
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
    email,
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

  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (!userRow) return res.json({ status: 400, msg: "No existing user !" });
    if (userRow.token != token)
      return res.json({ status: 400, msg: "Invalid token !" });

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
      return res.json({ status: 200, msg: "success", data: userRow });
    });
  } catch (error) {
    console.log(error);
    // return res.json({ status: 400, msg: "DB is not working !", data: error });
  }
};

/**
 * @function: Update user identity document from token, email
 *
 * @method: POST /update/identity
 *
 * @param {String|Required} email
 * @param {String|Required} token
 * @param {String|Required} documentType
 * @param {String|Required} identityDocument
 *
 * @returns { status: 200, msg: "success", data: userRow }
 */
exports.postUpdateIdentity = async (req, res) => {
  const gfs = req.app.get("gfs");
  var { email, token, documentType, identityDocument } = req.body;

  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  if (!documentType || documentType == "")
    return res.json({ status: 400, msg: "Empty document type !" });
  if (!identityDocument || identityDocument == "")
    return res.json({ status: 400, msg: "Empty identity document !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (!userRow) return res.json({ status: 400, msg: "No existing user !" });
    if (userRow.token != token)
      return res.json({ status: 400, msg: "Invalid token !" });
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
      identityDocument: filename,
      // approvalStatus: "PENDING"
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
 * @function: Update user selfie from token, email
 *
 * @method: POST /update/selfie
 *
 * @param {String|Required} email
 * @param {String|Required} token
 * @param {String|Required} selfie
 *
 * @returns { status: 200, msg: "success", data: userRow }
 */
exports.postUpdateSelfie = async (req, res) => {
  const gfs = req.app.get("gfs");
  var { email, token, selfie } = req.body;

  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  if (!selfie || selfie == "")
    return res.json({ status: 400, msg: "Empty selfie !" });

  try {
    var userRow = await UserModel.findOne({ email });
    if (!userRow) return res.json({ status: 400, msg: "No existing user !" });
    if (userRow.token != token)
      return res.json({ status: 400, msg: "Invalid token !" });
    if (userRow.approvalStatus == "BLOCKED")
      return res.json({ status: 400, msg: "status is blocked !" });

    // save file
    var filename = `selfie-${Date.now()}`;
    filename = `${filename}.${UtilsModule.getImageExt(selfie)}`;
    UtilsModule.saveImagetoGrid(gfs, filename, selfie);
    // Add user
    userRow.set({
      selfie: filename,
      approvalStatus: "PENDING"
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
