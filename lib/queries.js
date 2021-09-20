import Sequelize from "sequelize";
import { validateGetBooksQuery } from "../schema/books.js";
const { Op } = Sequelize;

const validSortKeys = ["title", "isbn", "genre", "price", "reviews", "id"]
  .map((prefix) => [`${prefix}_asc`, `${prefix}_desc`]).flat();

export function createGetBooksQuery(req, res, next) {
  if (req.query.page) {
    req.query.page = Number(req.query.page);
  }
  if (req.query.perpage) {
    req.query.perpage = Number(req.query.perpage);
  }
  if (
    req.query.sort &&
    !validSortKeys.includes(req.query.sort.toLowerCase())
  ) {
    return res.status(400).json({
      errors: [{ message: `Invalid sort direction ${formattedQuery.sort}` }],
    });
  }
  const valid = validateGetBooksQuery(req.query);
  if (!valid) {
    return res.status(400).json({ errors: validateGetBooksQuery.errors });
  }

  const query = {};
  if (req.query.genre) {
    query.where = {};
    query.where.genre = { [Op.substring]: req.query.genre };
  }
  if (req.query.sort) {
    const [prefix, postfix] = req.query.sort.split("_");
    query.order = [[prefix, postfix.toUpperCase()]];
  }
  res.locals.query = query;
  next();
}
