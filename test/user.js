process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var mongoose = require("mongoose");
var expect = chai.expect;
var request = require("request");

var server = require("../src/app");
var UserModel = require("../src/models/user");

var should = chai.should();
chai.use(chaiHttp);

describe("User test", function() {
  UserModel.collection.drop();
  beforeEach(function(done) {
    var newUser = new UserModel({
      name: "test name",
      email: "test@mail.com",
      phone: "1234567",
      dob: "2018-01-01",
      nationalityCountry: "USA",
      residenceCountry: "USA",
      residenceAddress: "test address",
      adminContact: "admin contact",
      adminMessage: "admin message",
      backgroundCheckId: "backgroundCheckId"
    });
    newUser.save(function(err) {
      done();
    });
  });
  // afterEach(function(done) {
  //   UserModel.collection.drop();
  //   done();
  // });

  it("should update a SINGLE user on /user/update POST", function(done) {
    chai
      .request(server)
      .post("/user/update")
      .send({
        "name": "test name2",
        "email": "test@mail.com",
        "phone": "1234567",
        "dob": "2018-01-01",
        "nationalityCountry": "USA",
        "residenceCountry": "USA",
        "residenceAddress": "test address2",
        "adminContact": "admin contact2",
        "adminMessage": "admin message2",
        "backgroundCheckId": "backgroundCheckId2"
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        // res.body.should.have.property("data");
        // res.body.data.should.have.property("name");
        // res.body.data.name.should.equal("test name2");
        done();
      });
  });
});
