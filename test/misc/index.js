import { expect } from "chai";

export function testUnknownEndpoint(chai, server, done) {
  chai.request(server).get("/unknown").end((err, res) => {
    expect(res.status).to.equal(404);
    expect(res.body).to.be.a("object");
    expect(res.body.error).to.equal("Unknown Endpoint");
    done();
  });
}

export function testThrowError(chai, server, done) {
  chai.request(server).get("/throwerror").end((err, res) => {
    expect(res.status).to.equal(500);
    expect(res.body.errors).to.be.a("array");
    expect(res.body.errors[0]).to.be.a("object");
    expect(res.body.errors[0].message).to.equal("This is a test error");
    done();
  });
}
