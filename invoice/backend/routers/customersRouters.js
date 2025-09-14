const express = require("express");
const tryCatch = require("../middleware/tryCatch");
const Router = express.Router();

const db = require("../db/sqliteConn");
  
// get customers
Router.get("/customers", tryCatch(async (req, res) => {
db.all("SELECT * FROM customers", [], (err, rows) => {
   if (err) {
     console.error(err.message);
     return;
   }
   res.json(rows);
 });
}));


// get edit customer
Router.get("/customers/:id", tryCatch(async (req, res) => {
  
}));

// add customer
Router.post("/customers", tryCatch(async (req, res) => {
  
}));

// DELETE /customers/:id
Router.delete("/customers/:id", tryCatch(async (req, res) => {

}));

// UPDATE /customers/:id
Router.put("/customers/:id", tryCatch(async (req, res) => {
 
}));

module.exports = Router;