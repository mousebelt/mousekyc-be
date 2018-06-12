const nodemailer = require("nodemailer");
const config = require("../config");
const mailcomposer = require("mailcomposer");

exports.send = (from, to, subject, text) => {
  const mailgun = require('mailgun-js')({ apiKey: config.email.mailgun.private, domain: config.email.domain });
  // const mailOptions = {
  //   from,
  //   to,
  //   subject,
  //   text
  // };
  // mailgun.messages().send(data, function (error, body) {
  //   console.log(body);
  // });
  return new Promise((resolve, reject) => {
    let mail = mailcomposer({
      from,
      to,
      subject,
      html: text
    });

    mail.build((mailBuildError, message) => {
      let dataToSend = {
        to,
        message: message.toString('ascii')
      };

      mailgun.messages().sendMime(dataToSend, (err, body) => {
        if (err) {
          // this.logger.exception(err);
          reject(new Error(err));
        }
        resolve(body);
      });
    });
  });
};
// exports.send = (sender, recipient, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     service: "SendGrid",
//     auth: {
//       user: config.email.sendgrid.USER,
//       pass: config.email.sendgrid.PASS
//     }
//   });
//   const mailOptions = {
//     to: recipient,
//     from: sender,
//     subject,
//     text
//   };
//   return transporter
//     .sendMail(mailOptions);
// };