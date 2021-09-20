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
