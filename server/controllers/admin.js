const bluebird = require("bluebird");
const crypto = bluebird.promisifyAll(require("crypto"));
const nodemailer = require("nodemailer");
const passport = require("passport");
const fs = require("fs");

const config = require('../config');

const AdminModel = require("../models/admin");
const UserModel = require("../models/user");

const AuthModule = require("../modules/auth");
const UtilsModule = require("../modules/utils");
const MailService = require('../services/mail.service');

/**
 * @function: Admin user signup
 * 
 * @method: POST /signup
 * 
 * @param {String|Required} email
 * @param {String|Required} password
 * 
 * @return
 * { "status": 200, "msg": "success" }
*/
exports.postSignup = (req, res, next) => {
  let { email, password } = req.body;

  // validation
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Email is not valid" });
  if (!password || String(password).length < 4)
    return res.json({
      status: 400,
      msg: "Password must be at least 4 characters long !"
    });

  AdminModel.findOne({ email }, async (err, existingUser) => {
    if (err) {
      return res.json({ status: 400, msg: "User find error !" });
    }

    let user = existingUser;
    if (user)
      return res.json({ status: 400, msg: "User already existing !" });

    user = new AdminModel({
      email,
      password,
    });
    user.save(err => {
      if (err) {
        return res.json({ status: 400, msg: "User save error !" });
      }
      let token = "";
      crypto.randomBytes(8, (err, buf) => {
        token = buf.toString("hex");

        MailService.send(config.email.from.general, user.email, "Thanks for your registeration", `Welcome.\n\nYou are receiving this because you sign up.\n\n`)
          .then((body) => { console.log({ body }); })
          .catch(error => {
            console.log("Error occur while sending email", error);
          });
      });

      return res.json({
        status: 200,
        msg: "success"
      });
    });
  });
};

/**
 * @function: Admin user login
 * 
 * @method: POST /login
 * 
 * @param {String|Required} email
 * @param {String|Required} password
 * 
 * @return
 * { "status": 200, "msg": "success", data: { token } }
*/
exports.postLogin = (req, res, next) => {
  var { email, password } = req.body;

  // validation
  if (!UtilsModule.validateEmail(email))
    return res.json({ status: 400, msg: "Email is not valid !" });
  if (!password || String(password).length < 4)
    return res.json({ status: 400, msg: "Password must be at least 4 characters long !" });

  // do process
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.json({ status: 400, msg: 'errors', data: err });
    }
    if (!user) {
      return res.json({
        status: 400,
        msg: "Invalid user or password !"
      });
    }
    req.logIn(user, err => {
      if (err) {
        return res.json({ status: 400, msg: 'errors', data: err });
      }

      var token = AuthModule.makeLoginToken(user._id, { expiresIn: "7d" });
      res.set("authorization", token);
      res.json({ status: 200, msg: "success", data: { token } });
    });
  })(req, res, next);
};

/**
 * @function: Set approval status, approval description of user
 * 
 * @method: POST /approve_user
 * 
 * @param {String|Required} token
 * @param {String|Required} useremail
 * @param {String|Required} approvalStatus
 * @param {String} approvalDescription
 * 
 * @return
 * { "status": 200, "msg": "success", data: userInfo }
*/
exports.postApproveUser = async (req, res, next) => {
  var token = req.body.token;
  var useremail = req.body.useremail;
  var approvalStatus = req.body.approvalStatus;
  var approvalDescription = req.body.approvalDescription;

  // validation
  if (!token || token == '') return res.json({ status: 400, msg: 'Empty token !' });
  if (!UtilsModule.validateEmail(useremail)) return res.json({ status: 400, msg: 'Invalid useremail !' });
  if (!approvalStatus || approvalStatus == '') return res.json({ status: 400, msg: 'Empty approvalStatus !' });

  // logic
  var loggedAdmin = AuthModule.getAdminFromToken(token);
  if (!loggedAdmin) return res.json({ status: 400, msg: 'token is not valid !' });

  var userRow = await UserModel.findOne({ email: useremail });
  if (!userRow) return res.json({ status: 400, msg: 'user email is not exsiting !' });

  userRow.approvalStatus = approvalStatus;
  userRow.approvalDescription = approvalDescription;
  userRow.save(err => {
    if (err) return res.json({ status: 400, msg: 'user save error !' });
    return res.json({ status: 200, msg: 'success', data: userRow })
  })
};

/**
 * @function: List submissions
 * 
 * @method: POST /submission_list
 * 
 * @param {String|Required} token
 * @param {Number} offset
 * @param {Number} count
 * 
 * @return
 * { "status": 200, "msg": "success", data: [submission] }
*/
exports.postSubmissionList = async (req, res, next) => {
  var token = req.body.token;
  var approvalStatus = req.body.approvalStatus;
  var offset = Number(req.body.offset);
  var count = Number(req.body.count);

  if (!offset) offset = 0;
  if (!count) count = 16;

  // validation
  if (!token || token == '') return res.json({ status: 400, msg: 'Empty token !' });

  // logic
  var loggedAdmin = AuthModule.getAdminFromToken(token);
  if (!loggedAdmin) return res.json({ status: 400, msg: 'token is not valid !' });

  var cond = approvalStatus ? { approvalStatus } : {};
  var submissions = await UserModel.find(cond).sort({ updatedAt: 1, approvalStatus: -1 }).skip(offset).limit(count);

  return res.json({ status: 200, msg: 'success', data: submissions });
};


/**
 * @function: Update user's identity document
 * 
 * @method: POST /update/identity
 * 
 * @param {String|Required} token
 * @param {String|Required} useremail
 * @param {String|Required} documentType
 * @param {String|Required} identityDocument
 * 
 * @returns { status: 200, msg: "success", data: userRow }
 */
exports.postUpdateIdentity = async (req, res) => {
  const gfs = req.app.get("gfs");
  var { useremail, token, documentType, identityDocument } = req.body;

  if (!UtilsModule.validateEmail(useremail))
    return res.json({ status: 400, msg: "Invalid email !" });
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  if (!documentType || documentType == "")
    return res.json({ status: 400, msg: "Empty document type !" });
  if (!identityDocument || identityDocument == "")
    return res.json({ status: 400, msg: "Empty identity document !" });

  // logic
  var loggedAdmin = AuthModule.getAdminFromToken(token);
  if (!loggedAdmin) return res.json({ status: 400, msg: 'token is not valid !' });

  try {
    var userRow = await UserModel.findOne({ email: useremail });
    if (!userRow) return res.json({ status: 400, msg: "No existing user !" });

    // save file
    var filename = `identityDocument-${Date.now()}`;

    var contentType = identityDocument.split(";")[0].split(":")[1];
    if (contentType == "image/jpeg" || contentType == "image/jpg")
      filename = `${filename}.jpg`;
    else if (contentType == "image/gif") filename = `${filename}.gif`;
    else if (contentType == "image/png") filename = `${filename}.png`;
    else filename = `${filename}.tiff`;

    var filepath = base64Img.imgSync(identityDocument, "./uploads", filename);
    var writestream = gfs.createWriteStream({ filename });
    fs.createReadStream(filepath)
      .on("end", function () {
        fs.unlink(filepath, function(err) {
          if (err) console.log("unlink error: ", err);
        });
      })
      .pipe(writestream);
    // Add user
    userRow.set({
      documentType: documentType || userRow.documentType,
      identityDocument: filename,
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

/**
 * @function: Update user's selfie
 * 
 * @method: POST /update/selfie
 * 
 * @param {String|Required} token
 * @param {String|Required} useremail
 * @param {String|Required} selfie
 * 
 * @returns { status: 200, msg: "success", data: userRow }
 */
exports.postUpdateSelfie = async (req, res) => {
  const gfs = req.app.get("gfs");
  var { useremail, token, selfie } = req.body;

  if (!UtilsModule.validateEmail(useremail))
    return res.json({ status: 400, msg: "Invalid user email !" });
  if (!token || token == "")
    return res.json({ status: 400, msg: "Empty token !" });
  if (!selfie || selfie == "")
    return res.json({ status: 400, msg: "Empty selfie !" });

  // logic
  var loggedAdmin = AuthModule.getAdminFromToken(token);
  if (!loggedAdmin) return res.json({ status: 400, msg: 'token is not valid !' });

  try {
    var userRow = await UserModel.findOne({ email: useremail });
    if (!userRow) return res.json({ status: 400, msg: "No existing user !" });

    // save file
    var filename = `selfie-${Date.now()}`;

    var contentType = selfie.split(";")[0].split(":")[1];
    if (contentType == "image/jpeg" || contentType == "image/jpg")
      filename = `${filename}.jpg`;
    else if (contentType == "image/gif") filename = `${filename}.gif`;
    else if (contentType == "image/png") filename = `${filename}.png`;
    else filename = `${filename}.tiff`;

    var filepath = base64Img.imgSync(selfie, "./uploads", filename);
    var writestream = gfs.createWriteStream({ filename });
    fs.createReadStream(filepath)
      .on("end", function () {
        fs.unlink(filepath, function(err) {
          if (err) console.log("unlink error: ", err);
        });
      })
      .pipe(writestream);
    // Add user
    userRow.set({
      selfie: filename,
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
