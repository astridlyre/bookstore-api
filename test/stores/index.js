import { expect } from "chai";
import { testStores } from "../../lib/testData.js";

export function testGetStores(chai, server, done) {
  chai.request(server).get("/stores").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.stores).to.be.a("array");
    expect(res.body.stores).to.deep.equal(
      testStores.map((store, i) => ({ ...store, id: i + 1 })),
    );
    done();
  });
}

export function testCreateStore(chai, server, done) {
  const newStore = {
    name: "Suburb Store",
    address: {
      line1: "123 Fake Street",
      line2: "",
      city: "Burbia",
      state: "Freedom",
      country: "USA",
      postalCode: "49839",
    },
    phoneNumber: {
      main: "12345656587",
      fax: "12346567676",
      cell: "",
      home: "",
    },
  };
  chai.request(server).post("/stores").type("json").send(newStore).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body.store).to.be.a("object");
      expect(res.body.store).to.deep.equal({ ...newStore, id: 2 });
      done();
    },
  );
}

export function testGetStore(chai, server, done) {
  chai.request(server).get("/stores/1").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.store).to.be.a("object");
    expect(res.body.store).to.deep.equal({ ...testStores[0], id: 1 });
    done();
  });
}

export function testUpdateStore(chai, server, done) {
  const updates = {
    address: {
      line1: "12345 Fake Street",
    },
    phoneNumber: {
      main: "123456789",
    },
  };
  chai.request(server).put("/stores/2").type("json").send(updates).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(200);
      expect(res.body.store).to.be.a("object");
      expect(res.body.store.address.line1).to.equal(updates.address.line1);
      expect(res.body.store.phoneNumber.main).to.equal(
        updates.phoneNumber.main,
      );
      done();
    },
  );
}

export function testUpdateStoreWithError(chai, server, done) {
  const updates = { name: 2 };
  chai.request(server).put("/stores/2").type("json").send(updates).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.a("array");
      expect(res.body.errors[0].message).to.equal("'name' must be string");
      done();
    },
  );
}
