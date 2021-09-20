import { Author, Book, Client, Employee, Store } from "../models/index.js";
import {
  testAuthors,
  testBooks,
  testClients,
  testEmployees,
  testStores,
} from "./testData.js";
import db from "./db.js";

export default async function seed(close = true) {
  console.log("Syncing database");
  await db.sync({ force: true });
  await Promise.all(testAuthors.map((author) => Author.create(author)));
  await Promise.all(testBooks.map((book) => Book.create(book)));
  await Promise.all(testClients.map((client) => Client.create(client)));
  await Promise.all(testEmployees.map((employee) => Employee.create(employee)));
  await Promise.all(testStores.map((store) => Store.create(store)));
  if (close) {
    await db.close();
  }
  console.log("Done");
}
