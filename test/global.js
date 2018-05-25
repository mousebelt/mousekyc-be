process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var expect = chai.expect;
var request = require("request");

var server = require("../server/app");

var should = chai.should();
chai.use(chaiHttp);

describe("Global API test", function() {
  it("should get all coins GET", function(done) {
    chai
      .request(server)
      .get("/global/coins")
      .end(function(err, response) {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("object");
        done();
      });
  });
});

// describe("global controller test: Status and content", function() {
//   describe("Get Coins", function() {
//     it("status", function(done) {
//       request("http://localhost:3000/global/coins", function(error, response, body) {
//         expect(response.statusCode).to.equal(200);
//         done();
//       });
//     });
//   });
// });
