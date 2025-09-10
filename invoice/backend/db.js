const Datastore = require("@seald-io/nedb");
const path = require("path");

// JSON dosyaları proje içinde tutulacak
const customerDB = new Datastore({
  filename: path.join(__dirname, "customers.db"),
  autoload: true,
});

const productDB = new Datastore({
  filename: path.join(__dirname, "products.db"),
  autoload: true,
});

module.exports = { customerDB, productDB };
