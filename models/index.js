import Book from "./Book.js";
import Author from "./Author.js";
import Store from "./Store.js";
import Employee from "./Employee.js";
import Client from "./Client.js";
import BookSale from "./BookSale.js";
import Review from "./Review.js";
import Address from "./Address.js";
import PhoneNumber from "./PhoneNumber.js";

Book.belongsToMany(Author, { through: "bookAuthor" });
Book.belongsToMany(BookSale, { through: "bookBookSale" });
Book.hasMany(Review);

Author.hasMany(Book);

Store.hasMany(Employee);
Store.hasOne(Address);
Store.hasOne(PhoneNumber);
Employee.belongsTo(Store);
Employee.hasOne(Address);
Employee.hasOne(PhoneNumber);

Client.hasMany(Review);
Client.hasMany(BookSale);
Client.hasOne(Address);
Client.hasOne(PhoneNumber);

BookSale.hasMany(Book);
BookSale.belongsTo(Employee);
BookSale.belongsTo(Client);
BookSale.belongsTo(Store);

Store.hasMany(BookSale);
Employee.hasMany(BookSale);

Review.belongsTo(Book);
Review.belongsTo(Client);

Address.belongsTo(Client);
Address.belongsTo(Store);
Address.belongsTo(Employee);

export {
  Address,
  Author,
  Book,
  BookSale,
  Client,
  Employee,
  PhoneNumber,
  Review,
  Store,
};
