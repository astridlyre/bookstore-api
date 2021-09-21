import { Router } from "express";
import { Book } from "../models/index.js";
import Sequelize from "sequelize";
import { parseID } from "../middleware/misc.js";
import { validateCreateBook, validateUpdateBook } from "../schema/books.js";
import { formatError } from "../schema/index.js";
import { createGetBooksQuery } from "../lib/queries.js";

const booksRouter = Router();
const attributes = ["title", "isbn", "genre", "description", "price", "id"];

// GET => Lists and searches all books.
// Attributes:
//  "q": Optional search query
//  "genre": Optional book genre
//  "page": Page number to return (default of 0)
//  "perpage": Number of items to return per page (default 20)
//  "sort": Field name to sort by, [FIELD_NAME]_[ASC|DESC] e.g. title_asc
booksRouter.get(
  "/",
  createGetBooksQuery,
  async function getBooks(req, res, next) {
    try {
      const books = await Book.findAll({ ...res.locals.query, attributes });
      return res.json({ books });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

// POST => Creates a new book and saves it in the database
booksRouter.post("/", async function validateBody(req, res, next) {
  if (!validateCreateBook(req.body)) {
    return res.status(400).json({
      errors: validateCreateBook.errors.map(formatError),
    });
  }
  next();
}, async function createBook(req, res, next) {
  try {
    const newBook = await Book.create(req.body);
    return res.status(201).json({ book: newBook });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errors: error.errors.map((error) => error.message),
      });
    }
    next(error);
  }
});

// GET => Returns information about a specific book
booksRouter.get("/:id", parseID, async function getBook(req, res, next) {
  try {
    const book = await Book.findByPk(res.locals.id, { attributes });
    if (!book) {
      return res.status(404).json({ book: null });
    }
    return res.json({ book });
  } catch (error) {
    next(error);
  }
});

// PUT => Updates the information on a book
booksRouter.put("/:id", parseID, async function validateBody(req, res, next) {
  if (!validateUpdateBook(req.body)) {
    return res.status(400).json({
      errors: validateUpdateBook.errors.map(formatError),
    });
  }
  next();
}, async function updateBook(req, res, next) {
  try {
    const [, updatedBookArray] = await Book.update(req.body, {
      where: { id: res.locals.id },
      returning: true,
    });
    return res.json({ book: updatedBookArray[0] });
  } catch (error) {
    next(error);
  }
});

// GET => Returns the author(s) of a specific book (TODO)
booksRouter.get(
  "/:id/authors",
  parseID,
  async function getBookAuthors(req, res, next) {
    try {
      const book = await Book.findByPk(res.locals.id);
      if (!book) {
        return res.status(404).json({ book: null });
      }
      return res.json({ book });
    } catch (error) {
      next(error);
    }
  },
);

// GET => Returns user reviews for a specific book (TODO)
booksRouter.get(
  "/:id/reviews",
  parseID,
  async function getBookReviews(req, res, next) {
    try {
      const book = await Book.findByPk(res.locals.id);
      if (!book) {
        return res.status(404).json({ book: null });
      }
      return res.json({ book });
    } catch (error) {
      next(error);
    }
  },
);

export default booksRouter;
