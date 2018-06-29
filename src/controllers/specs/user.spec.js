const chai = require('chai');
chai.use(require('chai-http'));
const { expect, request } = chai;

const postRequest = (customApp, url) => {
  return request(customApp)
    .post(url)
    .set('Accept', 'application/json');
};

const getRequest = (customApp, url) => {
  return request(customApp)
    .get(url)
    .set('Accept', 'application/json');
};

describe('User', () => {
  describe('GET /user', () => {
    it('should get user data', (done) => {
      //   const token = 'verified_token';

      //   getRequest(factory.testAppForDashboardWithJumioProvider(), '/dashboard').set('Authorization', `Bearer ${ token }`).end((err, res) => {
      //     expect(res.status).to.equal(200);
      //     expect(res.body).to.deep.eq({
      //       ethBalance: '1.0001',
      //       tokenBalance: '500.00012345678912345',
      //       tokensSold: '5000',
      //       tokenPrice: {
      //         ETH: '0.005',
      //         USD: '1'
      //       },
      //       raised: {
      //         ETH: '2000',
      //         USD: '400000',
      //         BTC: '0'
      //       },
      //       daysLeft: Math.floor((1517443200 - Math.floor(Date.now() / 1000)) / (3600 * 24)) + 1
      //     });
      //     done();
      //   });
    });

    it('should get user data - with the balance from old contracts', (done) => {
      //   const token = 'verified_token';

      //   getRequest(factory.testAppForDashboardWithOldSmartContracts(), '/dashboard').set('Authorization', `Bearer ${ token }`).end((err, res) => {
      //     expect(res.status).to.equal(200);
      //     expect(res.body).to.deep.eq({
      //       ethBalance: '1.0001',
      //       tokenBalance: '500.00012345678912345',
      //       tokensSold: '15000',
      //       tokenPrice: {
      //         ETH: '0.005',
      //         USD: '1'
      //       },
      //       raised: {
      //         ETH: '6000',
      //         USD: '1200000',
      //         BTC: '0'
      //       },
      //       daysLeft: Math.floor((1517443200 - Math.floor(Date.now() / 1000)) / (3600 * 24)) + 1
      //     });
      //     done();
    });
  });
});
