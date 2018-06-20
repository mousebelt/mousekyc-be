const config = {
  port: 3000,
  // db: 'mongodb://mongo:27017/kyc-db',
  db: 'mongodb://localhost:27017/kyc-db',
  email: {
    domain: 'mail.norestlabs.com',
    mailgun: {
      public: 'pubkey-c34e8a067ae814f5efdb8a6ac6631ca5',
      private: '618dc03859a470f79b02cce432d679ad-47317c98-64c69d9d'
    },
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
