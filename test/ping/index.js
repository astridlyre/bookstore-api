import { expect } from "chai";

export function testPing(chai, server, done) {
  chai.request(server).get("/ping").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body).to.be.a("object");
    expect(res.body.success).to.equal(true);
    done();
  });
}
