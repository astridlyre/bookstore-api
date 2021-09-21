import createValidator, { baseQuery } from "./index.js";

const base = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    birthDate: { type: "string" },
    email: { type: "string" },
    hireDate: { type: "string" },
    employeeNumber: { type: "integer" },
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
