import { expect } from "chai";
import { testClients } from "../../lib/testData.js";

export function testGetClients(chai, server, done) {
  chai.request(server).get("/clients").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.clients).to.be.a("array");
    expect(res.body.clients.length).to.equal(testClients.length);
    expect(res.body.clients).to.deep.equal(
      testClients.map((client, i) => ({ ...client, id: i + 1 })),
    );
    done();
  });
}

export function testCreateClient(chai, server, done) {
  const newClient = {
    firstName: "Jorf",
    lastName: "Blimly",
    email: "jblims@grof.ca",
    address: {
      line1: "54 Front Grill",
      line2: "",
      city: "Krill",
      state: "Krillstof",
      country: "KRUL",
      postalCode: "V5H1K2",
    },
    phoneNumber: {
      cell: "12435657657",
      main: null,
      home: null,
      fax: null,
    },
  };
  chai.request(server).post("/clients").type("json").send(newClient).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body.client).to.be.a("object");
      expect(res.body.client).to.deep.equal({ ...newClient, id: 2 });
      done();
    },
  );
}

export function testGetClient(chai, server, done) {
  chai.request(server).get("/clients/1").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.client).to.be.a("object");
    expect(res.body.client).to.deep.equal({ ...testClients[0], id: 1 });
    done();
  });
}

export function testUpdateClient(chai, server, done) {
  const updates = {
    lastName: "Blimfly",
    address: {
      city: "Krullio",
    },
    phoneNumber: {
      main: "12345678989",
    },
  };
  chai.request(server).put("/clients/2").type("json").send(updates).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(200);
      expect(res.body.client).to.be.a("object");
      expect(res.body.client.lastName).to.equal(updates.lastName);
      expect(res.body.client.address.city).to.equal(updates.address.city);
      expect(res.body.client.phoneNumber.main).to.equal(
        updates.phoneNumber.main,
      );
      done();
    },
  );
}

export function testGetInvalidClient(chai, server, done) {
  chai.request(server).get("/clients/3").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(404);
    expect(res.body.client).to.equal(null);
    done();
  });
}
