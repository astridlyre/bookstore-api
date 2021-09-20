import Book from "./Book.js";
import Author from "./Author.js";
import Store from "./Store.js";
import Employee from "./Employee.js";
import Client from "./Client.js";
import BookSale from "./BookSale.js";
import Review from "./Review.js";
import Address from "./Address.js";
import PhoneNumbers from "./PhoneNumbers.js";

Book.belongsToMany(Author, { through: "bookAuthor" });
Book.belongsToMany(BookSale, { through: "bookBookSale" });
Book.hasMany(Review);

Author.hasMany(Book);

Store.hasMany(Employee);
Store.hasOne(Address);
Store.hasOne(PhoneNumbers);
Employee.belongsTo(Store);
Employee.hasOne(Address);
Employee.hasOne(PhoneNumbers);

Client.hasMany(Review);
Client.hasMany(BookSale);
Client.hasOne(Address);
Client.hasOne(PhoneNumbers);

BookSale.hasMany(Book);
BookSale.belongsTo(Employee);
BookSale.belongsTo(Client);
BookSale.belongsTo(Store);

Store.hasMany(BookSale);
Employee.hasMany(BookSale);

Review.belongsTo(Book);
Review.belongsTo(Client);

export {
  Address,
  Author,
  Book,
  BookSale,
  Client,
  Employee,
  PhoneNumbers,
  Review,
  Store,
};
