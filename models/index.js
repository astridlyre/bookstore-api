import Book from "./Book.js";
import Author from "./Author.js";
import Store from "./Store.js";
import Employee from "./Employee.js";
import Client from "./Client.js";
import Sale from "./Sale.js";
import Review from "./Review.js";
import Address from "./Address.js";
import PhoneNumber from "./PhoneNumber.js";
import Copy from "./Copy.js";

Book.belongsToMany(Author, { through: "bookAuthor" });
Book.belongsToMany(Sale, { through: "bookSale" });
Book.belongsToMany(Store, { through: Copy });
Book.hasMany(Review);

Author.hasMany(Book);

Store.hasMany(Employee);
Store.Address = Store.hasOne(Address);
Store.PhoneNumber = Store.hasOne(PhoneNumber);
Store.belongsToMany(Book, { through: Copy });

Employee.belongsTo(Store);
Employee.Address = Employee.hasOne(Address);
Employee.PhoneNumber = Employee.hasOne(PhoneNumber);

Client.hasMany(Review);
Client.hasMany(Sale);
Client.Address = Client.hasOne(Address);
Client.PhoneNumber = Client.hasOne(PhoneNumber);

Sale.hasMany(Book);
Sale.belongsTo(Employee);
Sale.belongsTo(Client);
Sale.belongsTo(Store);

Store.hasMany(Sale);
Employee.hasMany(Sale);

Review.belongsTo(Book);
Review.belongsTo(Client);

Address.belongsTo(Client);
Address.belongsTo(Store);
Address.belongsTo(Employee);

export {
  Address,
  Author,
  Book,
  Client,
  Employee,
  PhoneNumber,
  Review,
  Sale,
  Store,
};
