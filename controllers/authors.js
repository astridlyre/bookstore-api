import { Router } from "express";
import { Author } from "../models/index.js";
import { parseID } from "../middleware/misc.js";
import { createGetAuthorsQuery } from "../lib/queries.js";

const authorsRouter = Router();

// GET => Returns a list of authors. Attributes:
//  "q": free-text search on author's info
//  "genre": filters by authors with books of a genre
//  "page": default 0, which page to show
//  "perpage": results per page
//  "sort": [FEILD_VALUE]_[ASC|DESC] e.g. firstName_asc
authorsRouter.get(
  "/",
  createGetAuthorsQuery,
  async function getAuthors(req, res, next) {
    try {
      const authors = await Author.findAll({
        ...res.locals.query,
        attributes: [
          "firstName",
          "lastName",
          "imageUrl",
          "website",
          "id",
          "description",
        ],
      });
      return res.json({ authors });
    } catch (error) {
      next(error);
    }
  },
);

// POST => Creates a new author
authorsRouter.post("/", async function createAuthor(req, res, next) {
  try {
    const newAuthor = await Author.create(req.body);
    return res.status(201).json({ author: newAuthor });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errors: error.errors.map((error) => error.message),
      });
    }
    next(error);
  }
});

// GET => Get information on a specific author
authorsRouter.get("/:id", parseID, async function getAuthor(req, res, next) {
  try {
    const author = await Author.findByPk(res.locals.id, {
      attributes: [
        "firstName",
        "lastName",
        "description",
        "imageUrl",
        "website",
        "id",
      ],
    });
    if (!author) return res.json({ author: {} });
    return res.json({ author });
  } catch (error) {
    next(error);
  }
});

// PUT => Updates the data on a specific author
authorsRouter.put("/:id", parseID, async function updateAuthor(req, res, next) {
  try {
    const [, updatedAuthorArray] = await Author.update(req.body, {
      where: {
        id: res.locals.id,
      },
      returning: true,
    });
    return res.json({ author: updatedAuthorArray[0] });
  } catch (error) {
    next(error);
  }
});

// GET => Returns a list of books written by a specific author (TODO)
authorsRouter.get(
  "/:id/books",
  parseID,
  async function getAuthorBooks(req, res, next) {
    try {
      const author = await Author.findByPk(res.locals.id);
      return res.json({ author });
    } catch (error) {
      next(error);
    }
  },
);

export default authorsRouter;