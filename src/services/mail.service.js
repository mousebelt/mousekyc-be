// const mailcomposer = require('mailcomposer');
const config = require('../config');
const mailgun = require('mailgun-js')({ apiKey: config.email.mailgun.private, domain: config.email.domain }); // eslint-disable-line

function send(from, to, subject, text) {
    return new Promise((resolve, reject) => {
    const mail = {
      from,
      to,
      subject,
      html: text
    };
    mailgun.messages().send(mail, (err, body) => {
      if (err) {
        console.log(err);
        reject(new Error(err));
      }
      resolve(body);
    });
  });
}
exports.send = send;
