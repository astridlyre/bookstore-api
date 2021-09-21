import { Router } from "express";
import { Address, Employee, PhoneNumber } from "../models/index.js";
import { parseID } from "../middleware/misc.js";
import { createGetEmployeesQuery } from "../lib/queries.js";
import { formatError } from "../schema/index.js";
import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from "../schema/employees.js";

const employeesRouter = Router();
const attributes = [
  "firstName",
  "lastName",
  "birthDate",
  "email",
  "hireDate",
  "employeeNumber",
  "id",
];
const include = [
  {
    model: Address,
    attributes: ["line1", "line2", "city", "state", "country", "postalCode"],
  },
  { model: PhoneNumber, attributes: ["main", "fax", "cell", "home"] },
];

// GET => Returns a full list of employees working across all stores
employeesRouter.get(
  "/",
  createGetEmployeesQuery,
  async function getEmployees(req, res, next) {
    try {
      const employees = await Employee.findAll({
        ...res.locals.query,
        attributes,
        include,
      });
      return res.json({ employees });
    } catch (error) {
      next(error);
    }
  },
);

// POST => Create a new employee in the system
employeesRouter.post("/", function validateBody(req, res, next) {
  if (!validateCreateEmployee(req.body)) {
    return res.status(400).json({
      errors: validateCreateEmployee.errors.map(formatError),
    });
  }
  next();
}, async function (req, res, next) {
  try {
    const newEmployee = await Employee.create(req.body);
    await Promise.all([
      Address.create({ ...req.body.address, employeeId: newEmployee.id }),
      PhoneNumber.create({
        ...req.body.phoneNumber,
        employeeId: newEmployee.id,
      }),
    ]);
    const result = await Employee.findByPk(newEmployee.id, {
      attributes,
      include,
    });
    return res.status(201).json({ employee: result });
  } catch (error) {
    next(error);
  }
});

// GET => Returns the data on a specific employee
employeesRouter.get(
  "/:id",
  parseID,
  async function getEmployee(req, res, next) {
    try {
      const employee = await Employee.findByPk(res.locals.id, {
        attributes,
        include,
      });
      if (!employee) return res.status(404).json({ employee: {} });
      return res.json({ employee });
    } catch (error) {
      next(error);
    }
  },
);

// PUT => Updates the data on a specific employee
employeesRouter.put("/:id", parseID, function validateBody(req, res, next) {
  if (!validateUpdateEmployee(req.body)) {
    return res.status(400).json({
      errors: validateUpdateEmployee.errors.map(formatError),
    });
  }
  next();
}, async function updateEmployee(req, res, next) {
  try {
    const updates = [
      Employee.update(req.body, { where: { id: res.locals.id } }),
    ];
    if (req.body.address) {
      updates.push(
        Address.update(req.body.address, {
          where: { employeeId: res.locals.id },
        }),
      );
    }
    if (req.body.phoneNumber) {
      updates.push(
        PhoneNumber.update(req.body.phoneNumber, {
          where: { employeeId: res.locals.id },
        }),
      );
    }
    await Promise.all(updates);
    const result = await Employee.findByPk(res.locals.id, {
      attributes,
      include,
    });
    return res.json({ employee: result });
  } catch (error) {
    next(error);
  }
});

export default employeesRouter;
