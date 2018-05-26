const config = {
  port: 3000,
  db: 'mongodb://mongo:27017/kyc-db',
  email: {
    // domain: MAILGUN_DOMAIN || 'icodashboard.space',
    // mailgun: {
    //   secret: MAILGUN_API_KEY || 'key-0123456789'
    // },
    // mailjet: {
    //   apiKey: MAILJET_API_KEY,
    //   apiSecret: MAILJET_API_SECRET
    // },
    sendgrid: {
      USER: "ohtayoshida",
      PASS: "sendgrid123"
    },
    from: {
      general: "hello@norestlabs.com",
      //   referral: EMAIL_REFERRAL || 'partners@icodashboard.space'
    },
    template: {
      folder: 'default',
    }
  },
}

module.exports = config;
