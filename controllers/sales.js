import { Router } from "express";
import { Address, Book, Client, PhoneNumber, Sale } from "../models/index.js";
import { createGetSalesQuery } from "../lib/queries.js";
import { handleValidationError, parseID } from "../middleware/misc.js";
import { validateCreateSale, validateUpdateSale } from "../schema/sales.js";
import { formatError } from "../schema/index.js";
import {
  addressAttributes,
  bookAttributes,
  clientAttributes,
  phoneNumberAttributes,
  saleAttributes,
} from "../lib/attributes.js";

const salesRouter = Router();
const include = [
  {
    model: Client,
    attributes: clientAttributes,
    include: [{ model: Address, attributes: addressAttributes }, {
      model: PhoneNumber,
      attributes: phoneNumberAttributes,
    }],
  },
  {
    model: Book,
    attributes: bookAttributes,
  },
];

// GET => Returns a list of sales. The results can be filtered by time range or
// by store.
salesRouter.get(
  "/",
  createGetSalesQuery,
  async function getSales(req, res, next) {
    try {
      const sales = await Sale.findAll({
        ...res.locals.query,
        attributes: saleAttributes,
        include,
      });
      return res.json({ sales });
    } catch (error) {
      next(error);
    }
  },
);

// POST => Create a new sale
salesRouter.post("/", function validateBody(req, res, next) {
  if (!validateCreateSale(req.body)) {
    return res.status(400).json({
      errors: validateCreateSale.errors.map(formatError),
    });
  }
  next();
}, async function createSale(req, res, next) {
  try {
    const sale = await Sale.create(req.body);
    const books = await Promise.all(
      req.body.books.map((id) => Book.findByPk(id)),
    );
    await sale.addBooks(books);
    const result = await Sale.findByPk(sale.id, {
      attributes: saleAttributes,
      include,
    });
    return res.status(201).json({ sale: result });
  } catch (error) {
    console.log(error);
    handleValidationError(error, res);
    next(error);
  }
});

// GET => Get the details of a sale
salesRouter.get("/:id", parseID, async function getSale(req, res, next) {
  try {
    const sale = await Sale.findByPk(res.locals.id, {
      attributes: saleAttributes,
      include,
    });
    if (!sale) return res.status(404).json({ sale: null });
    return res.json({ sale });
  } catch (error) {
    next(error);
  }
});

// PUT => Update the details of a sale
salesRouter.put("/:id", parseID, function validateBody(req, res, next) {
  if (!validateUpdateSale(req.body)) {
    return res.status(400).json({
      errors: validateUpdateSale.errors.map(formatError),
    });
  }
  next();
}, async function updateSale(req, res, next) {
  try {
    await Sale.update(req.body, { where: { id: res.locals.id } });
    const updatedSale = await Sale.findByPk(res.locals.id, {
      attributes: saleAttributes,
      include,
    });
    return res.json({ sale: updatedSale });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

export default salesRouter;
