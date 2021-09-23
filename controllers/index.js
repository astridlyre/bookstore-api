import authorsRouter from "./authors.js";
import booksRouter from "./books.js";
import clientsRouter from "./clients.js";
import employeesRouter from "./employees.js";
import pingRouter from "./ping.js";
import storesRouter from "./stores.js";
import salesRouter from "./sales.js";
import reviewsRouter from "./reviews.js";

export default {
  "/authors": authorsRouter,
  "/books": booksRouter,
  "/clients": clientsRouter,
  "/employees": employeesRouter,
  "/ping": pingRouter,
  "/reviews": reviewsRouter,
  "/sales": salesRouter,
  "/stores": storesRouter,
};
