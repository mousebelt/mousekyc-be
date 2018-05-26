const nodemailer = require("nodemailer");
const config = require("../config");

exports.send = (sender, recipient, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: config.email.sendgrid.USER,
      pass: config.email.sendgrid.PASS
    }
  });
  const mailOptions = {
    to: recipient,
    from: sender,
    subject,
    text
  };
  return transporter
    .sendMail(mailOptions);
};