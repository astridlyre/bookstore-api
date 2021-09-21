import createValidator, {
  addressSchema,
  baseQuery,
  phoneNumberSchema,
} from "./index.js";

const base = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
  },
};

const createClientBase = Object.create(base);
createClientBase.properties.address = { ...addressSchema };
createClientBase.properties.phoneNumber = { ...phoneNumberSchema };

const updateClientBase = Object.create(base);
updateClientBase.properties.address = { ...addressSchema };
updateClientBase.properties.phoneNumber = { ...phoneNumberSchema };

export const validateCreateClient = createValidator({
  ...createClientBase,
  required: ["firstName", "lastName"],
});

export const validateUpdateClient = createValidator(updateClientBase);

const getClientsQuery = Object.create(baseQuery);
getClientsQuery.properties.q = {
  type: "string",
};
export const validateGetClientsQuery = createValidator(getClientsQuery);
