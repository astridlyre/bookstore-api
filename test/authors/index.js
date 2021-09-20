import { expect } from "chai";
import { testAuthors } from "../../lib/testData.js";

export function testGetAuthors(chai, server, done) {
  chai.request(server).get("/authors").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.authors).to.be.a("array");
    expect(res.body.authors.length).to.equal(testAuthors.length);
    expect(res.body.authors).to.deep.equal(
      testAuthors.map((author, i) => ({ ...author, id: i + 1 })),
    );
    done();
  });
}

export function testCreateAuthor(chai, server, done) {
  const newAuthor = {
    firstName: "Jim",
    lastName: "Brown",
    description: "A classicl author of the highest order.",
    website: "https://www.jbrwn.org",
    imageUrl: "https://www.jbrwn.org/headshots/me.jpg",
  };
  chai.request(server).post("/authors").type("json").send(newAuthor).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body.author).to.be.a("object");
      expect(res.body.author.firstName).to.equal(newAuthor.firstName);
      done();
    },
  );
}

export function testGetAuthor(chai, server, done) {
  chai.request(server).get("/authors/1").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.author).to.be.a("object");
    expect(res.body.author).to.deep.equal({ ...testAuthors[0], id: 1 });
    done();
  });
}

export function testUpdateAuthor(chai, server, done) {
  const updatedAuthor = {
    lastName: "Browning",
  };
  chai.request(server).put("/authors/3").type("json").send(updatedAuthor).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(200);
      expect(res.body.author).to.be.a("object");
      expect(res.body.author.lastName).to.equal(updatedAuthor.lastName);
      done();
    },
  );
}

export function testGetAuthorsSortByIDDesc(chai, server, done) {
  chai.request(server).get("/authors?sort=id_desc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.authors).to.be.a("array");
    // Because we added one in the test
    expect(res.body.authors.length).to.equal(testAuthors.length + 1);
    expect(res.body.authors[0].id).to.equal(3);
    done();
  });
}

export function testGetAuthorsSortByLastNameDesc(chai, server, done) {
  chai.request(server).get("/authors?sort=lastName_desc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.authors).to.be.a("array");
    expect(res.body.authors[0].lastName).to.equal("Legge");
    done();
  });
}

export function testGetAuthorsSortByFirstNameAsc(chai, server, done) {
  chai.request(server).get("/authors?sort=firstName_asc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.authors).to.be.a("array");
    expect(res.body.authors[0].firstName).to.equal("Elizabeth");
    done();
  });
}

export function testGetNonExistantAuthor(chai, server, done) {
  chai.request(server).get("/authors/831890").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(404);
    expect(res.body.author).to.equal(null);
    done();
  });
}
