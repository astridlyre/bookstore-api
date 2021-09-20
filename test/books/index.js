import { expect } from "chai";
import { testBooks } from "../../lib/testData.js";

export function testGetBooks(chai, server, done) {
  chai.request(server).get("/books").end((err, res) => {
    expect(res.status).to.equal(200);
    expect(res.body.books).to.be.a("array");
    expect(res.body.books).to.deep.equal(
      testBooks.map((book, i) => ({ ...book, id: i + 1 })),
    );
    done();
  });
}

export function testCreateBook(chai, server, done) {
  const newBook = {
    title: "Buggsy's New Book",
    isbn: "184389821890219",
    genre: "childrens",
    description: "Learn to count the fun way, with Buggsy!",
    price: 789,
  };
  chai.request(server).post("/books").type("json").send(newBook).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body).to.be.a("object");
      expect(res.body.book.title).to.equal(newBook.title);
      expect(res.body.book.isbn).to.equal(newBook.isbn);
      expect(res.body.book.price).to.equal(newBook.price);
      done();
    },
  );
}

export function testCreateBookWithMissingTitle(chai, server, done) {
  const newBook = {
    isbn: "918380921890",
    genre: "fake",
    description: "hello",
    price: 1,
  };
  chai.request(server).post("/books").type("json").send(newBook).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.a("array");
      expect(res.body.errors[0].message).to.equal(
        "must have required property 'title'",
      );
      done();
    },
  );
}

export function testCreateBookWithMissingProperties(chai, server, done) {
  const newBook = {
    description: "Hi",
  };
  chai.request(server).post("/books").type("json").send(newBook).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.a("array");
      expect(res.body.errors.map((error) => error.message)).to.deep.equal(
        [
          "must have required property 'title'",
          "must have required property 'isbn'",
          "must have required property 'genre'",
          "must have required property 'price'",
        ],
      );
      done();
    },
  );
}

export function testGetBook(chai, server, done) {
  const expectedBook = testBooks[0];
  chai.request(server).get("/books/1").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.book).to.deep.equal({ ...expectedBook, id: 1 });
    done();
  });
}

// This updates the book created in testCreateBook
export function testUpdateBook(chai, server, done) {
  const updatedBook = {
    title: "Buggsy's Updated Book",
  };
  chai.request(server).put("/books/4").type("json").send(updatedBook).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(200);
      expect(res.body.book.title).to.equal(updatedBook.title);
      done();
    },
  );
}

export function testGetBooksFilterByGenre(chai, server, done) {
  chai.request(server).get(`/books?genre=${testBooks[0].genre}`).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(200);
      expect(res.body.books).to.be.a("array");
      expect(res.body.books.length).to.equal(1);
      expect(res.body.books[0]).to.deep.equal({ ...testBooks[0], id: 1 });
      done();
    },
  );
}

export function testGetBooksSortByTitleAsc(chai, server, done) {
  chai.request(server).get("/books?sort=title_asc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.books).to.be.a("array");
    expect(res.body.books[0].title).to.equal("Love Crunch");
    done();
  });
}

export function testGetBooksSortByTitleDesc(chai, server, done) {
  chai.request(server).get("/books?sort=title_desc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.books).to.be.a("array");
    expect(res.body.books[0].title).to.equal("The Great Kippums Caper");
    done();
  });
}

export function testGetBooksSortByGenreDesc(chai, server, done) {
  chai.request(server).get("/books?sort=genre_desc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.books).to.be.a("array");
    expect(res.body.books[0].genre).to.equal("true crime");
    done();
  });
}

export function testGetBooksSortByPriceAsc(chai, server, done) {
  chai.request(server).get("/books?sort=price_asc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.books).to.be.a("array");
    expect(res.body.books[0].price).to.equal(1775);
    done();
  });
}

export function testGetBooksSortByPriceDesc(chai, server, done) {
  chai.request(server).get("/books?sort=price_desc").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(200);
    expect(res.body.books).to.be.a("array");
    expect(res.body.books[0].price).to.equal(2398);
    done();
  });
}

export function testGetNonExistantBook(chai, server, done) {
  chai.request(server).get("/books/890483").end((err, res) => {
    if (err) throw err;
    expect(res.status).to.equal(404);
    expect(res.body.book).to.equal(null);
    done();
  });
}
