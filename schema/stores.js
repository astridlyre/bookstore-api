import createValidator, {
  addressSchema,
  baseQuery,
  phoneNumberSchema,
} from "./index.js";

const base = {
  type: "object",
  properties: {
    name: { type: "string" },
    address: { ...addressSchema },
    phoneNumber: { ...phoneNumberSchema },
  },
};

const createStoreBase = {
  type: "object",
  properties: {
    name: { type: "string" },
    address: { ...addressSchema },
    phoneNumber: { ...phoneNumberSchema },
  },
};

createStoreBase.required = ["name"];
createStoreBase.properties.address.required = [
  "line1",
  "city",
  "state",
  "country",
  "postalCode",
];
createStoreBase.properties.phoneNumber.required = ["main", "fax"];

export const validateCreateStore = createValidator(createStoreBase);

export const validateUpdateStore = createValidator(base);

const getStoresQuery = Object.create(baseQuery);
getStoresQuery.properties.q = { type: "string" };
getStoresQuery.properties.name = { type: "string" };
getStoresQuery.properties.state = { type: "string" };

export const validateGetStoresQuery = createValidator(getStoresQuery);
