import { Router } from "express";
import { Address, Client, PhoneNumber } from "../models/index.js";
import { handleValidationError, parseID } from "../middleware/misc.js";
import { createGetClientsQuery } from "../lib/queries.js";
import {
  validateCreateClient,
  validateUpdateClient,
} from "../schema/clients.js";
import { formatError } from "../schema/index.js";

const clientsRouter = Router();
const attributes = ["firstName", "lastName", "email", "id"];
const include = [
  {
    model: Address,
    attributes: ["line1", "line2", "city", "state", "country", "postalCode"],
  },
  { model: PhoneNumber, attributes: ["main", "fax", "cell", "home"] },
];

// GET => Lists clients ordered alphabetically by name
clientsRouter.get(
  "/",
  createGetClientsQuery,
  async function getClients(req, res, next) {
    try {
      const clients = await Client.findAll({
        attributes,
        include,
      });
      return res.json({ clients });
    } catch (error) {
      next(error);
    }
  },
);

// POST => Creates a new client in the system
clientsRouter.post("/", function validateBody(req, res, next) {
  if (!validateCreateClient(req.body)) {
    return res.status(400).json({
      errors: validateCreateClient.errors.map(formatError),
    });
  }
  next();
}, async function createClient(req, res, next) {
  try {
    const newClient = await Client.create(req.body);
    await Promise.all([
      Address.create({ ...req.body.address, clientId: newClient.id }),
      PhoneNumber.create({ ...req.body.phoneNumber, clientId: newClient.id }),
    ]);
    const result = await Client.findByPk(newClient.id, { attributes, include });
    return res.status(201).json({ client: result });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

// GET => Returns the data on a specific client
clientsRouter.get("/:id", parseID, async function getClient(req, res, next) {
  try {
    const client = await Client.findByPk(res.locals.id, {
      attributes,
      include,
    });
    if (!client) return res.status(404).json({ client: null });
    return res.json({ client });
  } catch (error) {
    next(error);
  }
});

// PUT => Updates the data on a specific client
clientsRouter.put("/:id", parseID, function validateBody(req, res, next) {
  if (!validateUpdateClient(req.body)) {
    return res.status(400).json({
      errors: validateUpdateClient.errors.map(formatError),
    });
  }
  next();
}, async function updateClient(req, res, next) {
  try {
    const updates = [Client.update(req.body, { where: { id: res.locals.id } })];
    if (req.body.address) {
      updates.push(
        Address.update(req.body.address, {
          where: { clientId: res.locals.id },
        }),
      );
    }
    if (req.body.phoneNumber) {
      updates.push(
        PhoneNumber.update(req.body.phoneNumber, {
          where: { clientId: res.locals.id },
        }),
      );
    }
    await Promise.all(updates);
    const updatedClient = await Client.findByPk(res.locals.id, {
      attributes,
      include,
    });
    if (!updatedClient) return res.status(404).json({ client: null });
    return res.json({ client: updatedClient });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

export default clientsRouter;
