const config = {
  port: 3000,
  // db: 'mongodb://localhost:27017/kyc-db', // this is for local db
  db: 'mongodb://mongo:27017/kyc-db', // this for docker db
  email: {
    domain: 'mail.norestlabs.com',
    mailgun: {
      public: 'pubkey key',
      private: 'private key'
    },
    masterEmail: 'galen@norestlabs.com',
    from: {
      general: 'hello@norestlabs.com',
    },
    template: {
      folder: 'default',
    }
  },
  project: 'NRL-KYC',

  demoMode: false,
  API_KEY: 'apikey-1234567890',
  frontendBaseUrl: 'https://mousekyc.mousebelt.com',
  baseUrl: 'https://mousekyc-server.mousebelt.com',
};

module.exports = config;
