import buildServer from "../app.js";
import seed from "../lib/seed.js";
import { testBooks } from "../lib/testData.js";
import gracefulShutdown from "http-graceful-shutdown";
import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { testPing } from "./ping/index.js";
import { testThrowError, testUnknownEndpoint } from "./misc/index.js";
import {
  testCreateBook,
  testCreateBookWithMissingProperties,
  testCreateBookWithMissingTitle,
  testGetBook,
  testGetBooks,
  testGetBooksFilterByGenre,
  testGetBooksSortByGenreDesc,
  testGetBooksSortByPriceAsc,
  testGetBooksSortByPriceDesc,
  testGetBooksSortByTitleAsc,
  testGetBooksSortByTitleDesc,
  testGetBooksWithInvalidPage,
  testGetBooksWithInvalidSortKey,
  testGetBooksWithPerPage,
  testGetBooksWithPerPageAndPage,
  testGetBooksWithPerPageAndPageAndSortByIdDesc,
  testGetNonExistantBook,
  testUpdateBook,
} from "./books/index.js";
import {
  testCreateAuthor,
  testGetAuthor,
  testGetAuthors,
  testGetAuthorsPerPage,
  testGetAuthorsPerPageAndPage,
  testGetAuthorsPerPageAndPageSortByLastName,
  testGetAuthorsSortByFirstNameAsc,
  testGetAuthorsSortByIDDesc,
  testGetAuthorsSortByLastNameDesc,
  testGetNonExistantAuthor,
  testUpdateAuthor,
} from "./authors/index.js";
import {
  testCreateStore,
  testGetStore,
  testGetStores,
  testUpdateStore,
  testUpdateStoreWithError,
} from "./stores/index.js";

chai.use(chaiHttp);

describe("Bookstore API", function () {
  let server;
  let shutdown;

  before(async () => {
    await seed(false);
    const app = buildServer();
    server = app.listen(4000);
    shutdown = gracefulShutdown(server);
  });

  after(async () => await shutdown());

  // General API
  describe("Ping route", function () {
    it("Should return a status message if server is running", function (done) {
      testPing(chai, server, done);
    });
  });

  describe("Unknown Endpoint route", function () {
    it("Should return an error message if no route found", function (done) {
      testUnknownEndpoint(chai, server, done);
    });
  });

  describe("Error route", function () {
    it("Should return an error message if any error happens", function (done) {
      testThrowError(chai, server, done);
    });
  });

  // Books API
  describe("Books Router", function () {
    it("Should return a list of books", function (done) {
      testGetBooks(chai, server, done);
    });

    it("Should filter books by genre", function (done) {
      testGetBooksFilterByGenre(chai, server, done);
    });

    it("Should sort books by title_asc", function (done) {
      testGetBooksSortByTitleAsc(chai, server, done);
    });

    it("Should sort books by title_desc", function (done) {
      testGetBooksSortByTitleDesc(chai, server, done);
    });

    it("Should sort books by genre_desc", function (done) {
      testGetBooksSortByGenreDesc(chai, server, done);
    });

    it("Should sort books by price_asc", function (done) {
      testGetBooksSortByPriceAsc(chai, server, done);
    });

    it("Should sort books by price_desc", function (done) {
      testGetBooksSortByPriceDesc(chai, server, done);
    });

    it("Should allow setting max number of results", function (done) {
      testGetBooksWithPerPage(chai, server, done);
    });

    it("Should allow chosing which page of results", function (done) {
      testGetBooksWithPerPageAndPage(chai, server, done);
    });

    it("Should support pagination and sorting", function (done) {
      testGetBooksWithPerPageAndPageAndSortByIdDesc(chai, server, done);
    });

    it("Should create a new book and save it to the database", function (done) {
      testCreateBook(chai, server, done);
    });

    it("Should not allow creating a book with missing title", function (done) {
      testCreateBookWithMissingTitle(chai, server, done);
    });

    it("Should not create book with missing properties", function (done) {
      testCreateBookWithMissingProperties(chai, server, done);
    });

    it("Should return a single book by ID", function (done) {
      testGetBook(chai, server, done);
    });

    it("Should return not found if book doesn't exist", function (done) {
      testGetNonExistantBook(chai, server, done);
    });

    it("Should update a book", function (done) {
      testUpdateBook(chai, server, done);
    });

    it("Should throw an error with invalid sort key", function (done) {
      testGetBooksWithInvalidSortKey(chai, server, done);
    });

    it("Should throw an error with invalid page", function (done) {
      testGetBooksWithInvalidPage(chai, server, done);
    });
  });

  describe("Authors API", function () {
    it("Should return a list of authors", function (done) {
      testGetAuthors(chai, server, done);
    });

    it("Should return a list of authors limited perpage", function (done) {
      testGetAuthorsPerPage(chai, server, done);
    });

    it("Should return a list of authors limited perpage with page", function (
      done,
    ) {
      testGetAuthorsPerPageAndPage(chai, server, done);
    });

    it("Should create a new author", function (done) {
      testCreateAuthor(chai, server, done);
    });

    it(
      "Should return a list of authors sorted by last name, limited perpage " +
        "and with the page selected",
      function (done) {
        testGetAuthorsPerPageAndPageSortByLastName(chai, server, done);
      },
    );

    it("Should return the data on a specific author", function (done) {
      testGetAuthor(chai, server, done);
    });

    it("Should update the data on a specific author", function (done) {
      testUpdateAuthor(chai, server, done);
    });

    it("Should return a list of authors sorted by id_desc", function (done) {
      testGetAuthorsSortByIDDesc(chai, server, done);
    });

    it("Should sort the list of authors by lastName_desc", function (done) {
      testGetAuthorsSortByLastNameDesc(chai, server, done);
    });

    it("Should sort the list of authors by firstName_asc", function (done) {
      testGetAuthorsSortByFirstNameAsc(chai, server, done);
    });

    it("Should return null if not getting an exiting author", function (done) {
      testGetNonExistantAuthor(chai, server, done);
    });
  });

  describe("Stores API", function () {
    it("Should return a list of stores", function (done) {
      testGetStores(chai, server, done);
    });

    it("Should create a new store", function (done) {
      testCreateStore(chai, server, done);
    });

    it("Should get a single store", function (done) {
      testGetStore(chai, server, done);
    });

    it("Should update a store", function (done) {
      testUpdateStore(chai, server, done);
    });

    it("Should throw error with invalid update", function (done) {
      testUpdateStoreWithError(chai, server, done);
    });
  });
});
