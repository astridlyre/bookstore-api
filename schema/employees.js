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
    birthDate: { type: "string", format: "date" },
    email: { type: "string" },
    hireDate: { type: "string", format: "date" },
    employeeNumber: { type: "integer" },
    address: { ...addressSchema },
    phoneNumber: { ...phoneNumberSchema },
  },
};

export const validateCreateEmployee = createValidator({
  ...base,
  required: ["firstName", "lastName", "email", "hireDate", "employeeNumber"],
});

export const validateUpdateEmployee = createValidator(base);

const getEmployeesQuery = Object.create(baseQuery);
getEmployeesQuery.properties.q = {
  type: "string",
};

export const validateGetEmployeesQuery = createValidator(getEmployeesQuery);
