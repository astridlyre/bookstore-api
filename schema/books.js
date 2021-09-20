import createValidator, { baseQuery } from "./index.js";

const base = {
  type: "object",
  properties: {
    title: { type: "string" },
    isbn: { type: "string" },
    genre: { type: "string" },
    description: { type: "string" },
    price: { type: "integer" },
    authors: {
      type: "array",
      items: { type: "integer" },
    },
    stores: {
      type: "array",
      items: { type: "integer" },
    },
  },
};

export const validateCreateBook = createValidator({
  ...base,
  required: ["title", "isbn", "genre", "description", "price"],
});

export const validateUpdateBook = createValidator(base);

const getBooksQuery = Object.create(baseQuery);
getBooksQuery.properties.q = {
  type: "string",
};
getBooksQuery.properties.genre = {
  type: "string",
};
export const validateGetBooksQuery = createValidator(getBooksQuery);
