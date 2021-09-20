import Book from "../models/Book.js";
import { testBooks } from "./testData.js";
import db from "./db.js";

export default async function seed(close = true) {
  console.log("Syncing database");
  await db.sync({ force: true });
  await Promise.all(testBooks.map((book) => Book.create(book)));
  if (close) {
    await db.close();
  }
  console.log("Done");
}
