import createValidator, { baseQuery } from "./index.js";

const base = {
  type: "object",
  properties: {
    books: {
      type: "array",
      items: {
        type: "integer",
      },
    },
    clientId: {
      type: "integer",
    },
    employeeId: {
      type: "integer",
    },
    storeId: {
      type: "integer",
    },
  },
};

export const validateCreateSale = createValidator({
  ...base,
  required: ["books", "clientId", "employeeId", "storeId"],
});

export const validateUpdateSale = createValidator(base);

const getSalesQuery = Object.create(baseQuery);
getSalesQuery.properties.start_date = {
  type: "string",
};
getSalesQuery.properties.end_date = {
  type: "string",
};
getSalesQuery.properties.store_id = {
  type: "string",
};
export const validateGetSalesQuery = createValidator(getSalesQuery);
