process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const request = require('request');

const server = require('../src/app');

const should = chai.should();
chai.use(chaiHttp);

describe('Global API test', () => {
  it('should get all countries', (done) => {
    chai
      .request(server)
      .get('/global/countries')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        done();
      });
  });
});
