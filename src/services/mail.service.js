const mailcomposer = require('mailcomposer');
const config = require('../config');

function send(from, to, subject, text) {
  const mailgun = require('mailgun-js')({ apiKey: config.email.mailgun.private, domain: config.email.domain }); // eslint-disable-line
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
    const mail = mailcomposer({
      from,
      to,
      subject,
      html: text
    });

    mail.build((mailBuildError, message) => {
      const dataToSend = {
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
}
exports.send = send;
