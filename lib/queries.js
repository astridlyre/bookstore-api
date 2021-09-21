import Sequelize from "sequelize";
import { validateGetBooksQuery } from "../schema/books.js";
import { validateGetAuthorsQuery } from "../schema/authors.js";
import { validateGetStoresQuery } from "../schema/stores.js";
import { validateGetEmployeesQuery } from "../schema/employees.js";
import { formatError } from "../schema/index.js";
const { Op } = Sequelize;

const DEFAULT_NUMBER_PER_PAGE = 20;
const DEFAULT_PAGE = 0;

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

const validStoreSortKeys = createSortObject(["id", "name"]);

const validEmployeeSortKeys = createSortObject([
  "id",
  "firstName",
  "lastName",
  "hireDate",
  "employeeNumber",
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

export function createQuery(schemaValidator, sortKeys, queryComposers = []) {
  return (req, res, next) => {
    if (req.query.page) req.query.page = Number(req.query.page);
    if (req.query.perpage) req.query.perpage = Number(req.query.perpage);
    if (req.query.sort && !sortKeys[req.query.sort]) {
      return res.status(400).json({
        errors: [{ message: `invalid sort direction '${req.query.sort}'` }],
      });
    }
    if (!schemaValidator(req.query)) {
      return res.status(400).json({
        errors: schemaValidator.errors.map(formatError),
      });
    }

    const limit = typeof req.query.perpage === "number" && req.query.perpage > 0
      ? req.query.perpage
      : DEFAULT_NUMBER_PER_PAGE;
    const offset = typeof req.query.page === "number" && req.query.page > 0
      ? req.query.page * limit
      : DEFAULT_PAGE;
    const query = { limit, offset };
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

export const createGetStoresQuery = createQuery(
  validateGetStoresQuery,
  validStoreSortKeys,
);

export const createGetEmployeesQuery = createQuery(
  validateGetEmployeesQuery,
  validEmployeeSortKeys,
);
