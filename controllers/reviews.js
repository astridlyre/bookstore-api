import { Router } from "express";
import { Review } from "../models/index.js";
import { handleValidationError } from "../middleware/misc.js";
import {
  validateCreateReview,
  validateUpdateReview,
} from "../schema/reviews.js";
import { formatError } from "../schema/index.js";

const reviewsRouter = Router();

// POST => Saves a new client review of a book
reviewsRouter.post("/", function validateBody(req, res, next) {
  if (!validateCreateReview(req.body)) {
    return res.status(400).json({
      errors: validateCreateReview.errors.map(formatError),
    });
  }
  next();
}, async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);
    return res.status(201).json({ review });
  } catch (error) {
    handleValidationError(error, res);
    next(error);
  }
});

export default reviewsRouter;
