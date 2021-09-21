import { Router } from "express";
import { Sale } from "../models/index.js";

const salesRouter = Router();

// GET => Returns a list of sales. The results can be filtered by time range or
// by store.
salesRouter.get("/", async function getSales(req, res, next) {
  try {
    const sales = await Sale.findAll();
    return res.json({ sales });
  } catch (error) {
    next(error);
  }
});

export default salesRouter;
