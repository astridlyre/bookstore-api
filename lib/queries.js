import Sequelize from "sequelize";
import { validateGetBooksQuery } from "../schema/books.js";
import { validateGetAuthorsQuery } from "../schema/authors.js";
import { validateGetStoresQuery } from "../schema/stores.js";
import { validateGetEmployeesQuery } from "../schema/employees.js";
import { validateGetClientsQuery } from "../schema/clients.js";
import { validateGetSalesQuery } from "../schema/sales.js";
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

function addGenreAuthor(query, req) {
  if (req.query.genre) {
    const result = { ...query };
    if (!result.where) {
      result.where = {};
    }
    result.where["$book.genre$"] = { [Op.substring]: req.query.genre };
    return result;
  }
  return query;
}

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

function addQ(keys) {
  return (query, req) => {
    if (req.query.q) {
      const result = { ...query };
      if (!result.where) {
        result.where = {};
      }
      result.where[Op.or] = keys.map((key) => ({
        [key]: {
          [Op.substring]: req.query.q,
        },
      }));
      return result;
    }
    return query;
  };
}

function addDateRange(query, req) {
  if (req.query.start_date || req.query.end_date) {
    const result = { ...query };
    if (!result.where) {
      result.where = {};
    }
    if (req.query.start_date) {
      result.where.createdAt = {
        [Op.gt]: req.query.start_date,
      };
    }
    if (req.query.end_date) {
      result.where.createdAt = {
        ...result.where.createdAt,
        [Op.lt]: req.query.end_date,
      };
    }
    return result;
  }
  return query;
}

function addStoreId(query, req) {
  if (req.query.store_id) {
    const result = { ...query };
    if (!result.where) result.where = {};
    result.where.storeId = req.query.store_id;
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
  createSortObject([
    "title",
    "isbn",
    "genre",
    "price",
    "reviews",
    "id",
  ]),
  [addGenre, addQ(["title", "genre", "description"])],
);

export const createGetAuthorsQuery = createQuery(
  validateGetAuthorsQuery,
  createSortObject([
    "firstName",
    "lastName",
    "id",
  ]),
  [addGenreAuthor, addQ(["firstName", "lastName", "description"])],
);

export const createGetStoresQuery = createQuery(
  validateGetStoresQuery,
  createSortObject(["id", "name"]),
  [addQ(["name"])],
);

export const createGetEmployeesQuery = createQuery(
  validateGetEmployeesQuery,
  createSortObject([
    "id",
    "firstName",
    "lastName",
    "hireDate",
    "employeeNumber",
  ]),
  [addQ(["firstName", "lastName", "employeeNumber"])],
);

export const createGetClientsQuery = createQuery(
  validateGetClientsQuery,
  createSortObject([
    "id",
    "firstName",
    "lastName",
  ]),
  [addQ(["firstName", "lastName", "email"])],
);

export const createGetSalesQuery = createQuery(
  validateGetSalesQuery,
  [],
  [addStoreId, addDateRange],
);
