import Sequelize from "sequelize";
import { validateGetBooksQuery } from "../schema/books.js";
import { validateGetAuthorsQuery } from "../schema/authors.js";
const { Op } = Sequelize;

function createSortObject(keys) {
  return Object.fromEntries(
    keys.map((prefix) => [[`${prefix}_asc`, true], [`${prefix}_desc`, true]])
      .flat(),
  );
}

const validBookSortKeys = createSortObject([
  "title",
  "isbn",
  "genre",
  "price",
  "reviews",
  "id",
]);

const validAuthorSortKeys = createSortObject([
  "firstName",
  "lastName",
  "id",
]);

function addGenre(query, req) {
  if (req.query.genre) {
    const result = { ...query };
    if (!result.where) {
      result.where = {};
    }
    result.where.genre = { [Op.substring]: req.query.genre };
    return result;
  }
  return query;
}

export function createQuery(schemaValidator, sortKeys, queryComposers) {
  return (req, res, next) => {
    if (req.query.page) {
      req.query.page = Number(req.query.page);
    }
    if (req.query.perpage) {
      req.query.perpage = Number(req.query.perpage);
    }
    if (req.query.sort && !sortKeys[req.query.sort]) {
      return res.status(400).json({
        errors: [{ message: `Invalid sort direction ${formattedQuery.sort}` }],
      });
    }
    const valid = schemaValidator(req.query);
    if (!valid) {
      return res.status(400).json({ errors: schemaValidator.errors });
    }

    const query = {};
    if (req.query.sort) {
      const [prefix, postfix] = req.query.sort.split("_");
      query.order = [[prefix, postfix.toUpperCase()]];
    }
    res.locals.query = queryComposers.reduce(
      (q, composer) => composer(q, req),
      query,
    );
    next();
  };
}

export const createGetBooksQuery = createQuery(
  validateGetBooksQuery,
  validBookSortKeys,
  [addGenre],
);

export const createGetAuthorsQuery = createQuery(
  validateGetAuthorsQuery,
  validAuthorSortKeys,
  [addGenre],
);
