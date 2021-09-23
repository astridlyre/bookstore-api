import { Router } from "express";
import { Author, Book, Client, Review } from "../models/index.js";
import Sequelize from "sequelize";
import { handleValidationError, parseID } from "../middleware/misc.js";
import { validateCreateBook, validateUpdateBook } from "../schema/books.js";
import { formatError } from "../schema/index.js";
import { createGetBooksQuery } from "../lib/queries.js";
import { authorAttributes, bookAttributes } from "../lib/attributes.js";

const booksRouter = Router();

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
      const books = await Book.findAll({
        ...res.locals.query,
        attributes: bookAttributes,
      });
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
    if (req.body.authors) {
      const authors = await Promise.all(
        req.body.authors.map((id) => Author.findByPk(id)),
      );
      await newBook.addAuthors(authors);
    }
    return res.status(201).json({ book: newBook });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

// GET => Returns information about a specific book
booksRouter.get("/:id", parseID, async function getBook(req, res, next) {
  try {
    const book = await Book.findByPk(res.locals.id, {
      attributes: bookAttributes,
    });
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
    return res.json({ book: updatedBookArray[0] ?? null });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

// GET => Returns the author(s) of a specific book
booksRouter.get(
  "/:id/authors",
  parseID,
  async function getBookAuthors(req, res, next) {
    try {
      const book = await Book.findByPk(res.locals.id, {
        include: [{
          model: Author,
          attributes: authorAttributes,
          through: { attributes: [] },
        }],
      });
      if (!book) {
        return res.status(404).json({ book: null });
      }
      return res.json({ authors: book.authors });
    } catch (error) {
      next(error);
    }
  },
);

// GET => Returns user reviews for a specific book
booksRouter.get(
  "/:id/reviews",
  parseID,
  async function getBookReviews(req, res, next) {
    try {
      const reviews = await Review.findAll({
        where: {
          bookId: res.locals.id,
        },
        include: [{ model: Client, attributes: ["firstName", "lastName"] }],
        order: [["createdAt", "DESC"]],
      });
      if (!reviews) return res.status(404).json({ reviews: [] });
      return res.json({ reviews });
    } catch (error) {
      next(error);
    }
  },
);

export default booksRouter;
