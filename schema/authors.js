import createValidator, { baseQuery } from "./index.js";

const base = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    description: { type: "string" },
    books: {
      type: "array",
      items: { type: "integer" },
    },
    website: { type: "string", format: "uri" },
    imageUrl: { type: "string", format: "uri" },
  },
};

export const validateCreateAuthor = createValidator({
  ...base,
  required: ["firstName", "lastName"],
});

export const validateUpdateAuthor = createValidator(base);

const getAuthorsQuery = Object.create(baseQuery);
getAuthorsQuery.properties.q = {
  type: "string",
};
getAuthorsQuery.properties.genre = {
  type: "string",
};
export const validateGetAuthorsQuery = createValidator(getAuthorsQuery);
