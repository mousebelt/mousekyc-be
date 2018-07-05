const config = {
  port: 3000,
  db: 'mongodb://mongo:27017/kyc-db',
  // db: 'mongodb://localhost:27017/kyc-db',
  email: {
    domain: 'mail.norestlabs.com',
    mailgun: {
      public: 'pubkey-c34e8a067ae814f5efdb8a6ac6631ca5',
      private: '618dc03859a470f79b02cce432d679ad-47317c98-64c69d9d'
    },
    masterEmail: "galen@norestlabs.com",
    from: {
      general: "hello@norestlabs.com",
    },
    template: {
      folder: 'default',
    }
  },
  project: 'NRL-KYC',

  demoMode: false,
  API_KEY: 'apikey-1234567890',
  frontendBaseUrl: 'http://54.152.190.110',
  baseUrl: 'http://54.152.190.110:3000',
}

module.exports = config;
