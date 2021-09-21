import {
  Address,
  Author,
  Book,
  Client,
  Employee,
  PhoneNumber,
  Store,
} from "../models/index.js";
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
  await Promise.all(testClients.map(async (client) => {
    const newClient = await Client.create(client);
    await Address.create({ ...client.address, clientId: newClient.id });
    await PhoneNumber.create({ ...client.phoneNumber, clientId: newClient.id });
  }));
  await Promise.all(testEmployees.map(async (employee) => {
    const newEmployee = await Employee.create(employee);
    await Address.create({ ...employee.address, employeeId: newEmployee.id });
    await PhoneNumber.create({
      ...employee.phoneNumber,
      employeeId: newEmployee.id,
    });
  }));
  await Promise.all(testStores.map(async (store) => {
    const newStore = await Store.create(store);
    await Address.create({
      ...store.address,
      storeId: newStore.id,
    });
    await PhoneNumber.create({
      ...store.phoneNumber,
      storeId: newStore.id,
    });
  }));
  if (close) {
    await db.close();
  }
  console.log("Done");
}
