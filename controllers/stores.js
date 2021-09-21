import { Router } from "express";
import { Address, PhoneNumber, Store } from "../models/index.js";
import { handleValidationError, parseID } from "../middleware/misc.js";
import { validateCreateStore, validateUpdateStore } from "../schema/stores.js";
import { validateGetBooksQuery } from "../schema/books.js";
import { formatError } from "../schema/index.js";
import {
  addressAttributes,
  phoneNumberAttributes,
  storeAttributes,
} from "../lib/attributes.js";

const storesRouter = Router();
const include = [
  {
    model: Address,
    attributes: addressAttributes,
  },
  { model: PhoneNumber, attributes: phoneNumberAttributes },
];

// GET => Returns the list of stores
storesRouter.get("/", async function getStores(req, res, next) {
  try {
    const stores = await Store.findAll({
      ...res.locals.query,
      attributes: storeAttributes,
      include,
    });
    return res.json({ stores });
  } catch (error) {
    next(error);
  }
});

// POST => Creates a new store in the system
storesRouter.post("/", function validateBody(req, res, next) {
  if (!validateCreateStore(req.body)) {
    return res.status(400).json({
      errors: validateCreateStore.errors.map(formatError),
    });
  }
  next();
}, async function createStore(req, res, next) {
  try {
    const newStore = await Store.create(req.body, {
      include: [{ association: Store.Address }, {
        association: Store.PhoneNumber,
      }],
    });
    const result = await Store.findByPk(newStore.id, {
      attributes: storeAttributes,
      include: include,
    });
    return res.status(201).json({ store: result });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

// GET => Returns the data on a specific store
storesRouter.get("/:id", parseID, async function getStore(req, res, next) {
  try {
    const store = await Store.findByPk(res.locals.id, {
      attributes: storeAttributes,
      include,
    });
    if (!store) return res.status(404).json({ store: null });
    return res.json({ store });
  } catch (error) {
    next(error);
  }
});

// PUT => Updates the information about a specific store
storesRouter.put("/:id", parseID, function validateBody(req, res, next) {
  if (!validateUpdateStore(req.body)) {
    return res.status(400).json({
      errors: validateUpdateStore.errors.map(formatError),
    });
  }
  next();
}, async function updateStore(req, res, next) {
  try {
    const updates = [];
    if (req.body.address) {
      updates.push(Address.update(req.body.address, {
        where: { storeId: res.locals.id },
      }));
    }
    if (req.body.phoneNumber) {
      updates.push(PhoneNumber.update(req.body.phoneNumber, {
        where: { storeId: res.locals.id },
      }));
    }
    if (req.body.name) {
      updates.push(Store.update({ name: req.body.name }, {
        where: { storeId: res.locals.id },
      }));
    }
    await Promise.all(updates);
    const updatedStore = await Store.findByPk(res.locals.id, {
      attributes: storeAttributes,
      include,
    });
    if (!updatedStore) return res.status(404).json({ store: null });
    return res.json({ store: updatedStore });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

export default storesRouter;
