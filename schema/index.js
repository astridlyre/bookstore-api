import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

export default function createValidator(schema) {
  return ajv.compile(schema);
}

export const baseQuery = {
  type: "object",
  properties: {
    page: {
      type: "integer",
    },
    perpage: {
      type: "integer",
    },
    sort: {
      type: "string",
    },
  },
};

export const addressSchema = {
  type: "object",
  properties: {
    line1: { type: "string" },
    line2: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    country: { type: "string" },
    postalCode: { type: "string" },
  },
};

export const phoneNumberSchema = {
  type: "object",
  properties: {
    main: { type: "string" },
    fax: { type: "string" },
    home: { type: "string" },
    cell: { type: "string" },
  },
};

export function formatError(error) {
  if (error.instancePath) {
    return { message: `'${error.instancePath.substring(1)}' ${error.message}` };
  }
  return { message: error.message };
}
