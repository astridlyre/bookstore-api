import createValidator from "./index.js";

const base = {
  type: "object",
  properties: {
    clientId: { type: "integer" },
    bookId: { type: "integer" },
    text: { type: "string" },
    stars: { enum: [0, 1, 2, 3, 4, 5] },
  },
};

export const validateCreateReview = createValidator({
  ...base,
  required: ["clientId", "bookId", "stars"],
});

export const validateUpdateReview = createValidator(base);
