import { expect } from "chai";

export function testCreateReview(chai, server, done) {
  const review = {
    bookId: 1,
    clientId: 1,
    text: "This book is awesome",
    stars: 5,
  };
  chai.request(server).post("/reviews").type("json").send(review).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(201);
      expect(res.body.review).to.be.a("object");
      expect(res.body.review.text).to.equal(review.text);
      expect(res.body.review.stars).to.equal(review.stars);
      done();
    },
  );
}

export function testCreateReviewWithInvalidStar(chai, server, done) {
  const review = {
    bookId: 1,
    clientId: 1,
    text: "This book is awesome",
    stars: 69,
  };
  chai.request(server).post("/reviews").type("json").send(review).end(
    (err, res) => {
      if (err) throw err;
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.a("array");
      expect(res.body.errors[0].message).to.equal(
        "'stars' must be equal to one of the allowed values",
      );
      done();
    },
  );
}
