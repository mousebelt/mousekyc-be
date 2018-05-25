const bluebird = require("bluebird");
const crypto = bluebird.promisifyAll(require("crypto"));
const nodemailer = require("nodemailer");
const passport = require("passport");
const fs = require("fs");

const AdminModel = require("../models/admin");
const AuthModule = require("../modules/auth");
const UtilsModule = require("../modules/utils");

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  let { email, password } = req.body;
  const config = req.app.get("config");

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
        const transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: config.sendgrid.USER,
            pass: config.sendgrid.PASS
          }
        });
        const mailOptions = {
          to: user.email,
          from: "hello@norestlabs.com",
          subject: "Thanks for your registeration",
          text: `Welcome.\n\nYou are receiving this because you sign up.\n\n`
        };
        return transporter
          .sendMail(mailOptions)
          .then(() => { })
          .catch(error => {
            console.log("Error occur while sending email");
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
 * POST /login
 * Sign in using email and password.
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
