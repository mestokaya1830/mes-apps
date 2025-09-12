const express = require("express");
const cors = require("cors");
const tryCatch = require("../middleware/tryCatch");
const { customerDB, productDB } = require("../db/connection.js");

const Router = express.Router();
  
// get customers
Router.get("/customers", tryCatch(async (req, res) => {
  const docs = await customerDB.find({});
  res.json(docs);
}));


// get edit customer
Router.get("/customers/:id", tryCatch(async (req, res) => {
  customerDB.findOne({ _id: String(req.params.id) }, (err, docs) => {
    if (err) return res.status(500).send(err);
    res.json(docs);
  });
}));

// add customer
Router.post("/customers", tryCatch(async (req, res) => {
  const newDoc = await customerDB.insert(req.body);
  res.json(newDoc);
}));

// DELETE /customers/:id
Router.delete("/customers/:id", tryCatch(async (req, res) => {
  const numRemoved = await customerDB.remove({ _id: String(req.params.id) }, {});
  if (numRemoved === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted", id: req.params.id });
}));

// UPDATE /customers/:id
Router.put("/customers/:id", tryCatch(async (req, res) => {
  customerDB.update(
    { _id: String(req.params.id) },
    { $set: req.body },
    {},
    (err, numUpdated) => {
      if (err) return res.status(500).send(err);
      if (numUpdated === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer updated", id: req.params.id });
    }
  );
}));

module.exports = Router;