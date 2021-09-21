import { expect } from "chai";

export function testCreateSale(chai, server, done) {
  const sale = {
    books: [1],
    employeeId: 1,
    clientId: 1,
    storeId: 1,
  };
  chai.request(server).post("/sales").type("json").send(sale).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body.sale).to.be.a("object");
      expect(res.body.sale.books[0].title).to.equal("The Great Kippums Caper");
      expect(res.body.sale.client.firstName).to.equal("Joe");
      done();
    },
  );
}

export function testGetSales(chai, server, done) {
  chai.request(server).get("/sales").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.sales).to.be.a("array");
    expect(res.body.sales.length).to.equal(1);
    done();
  });
}
