const express = require("express");
const cors = require("cors");
const { customerDB, productDB } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// get customers
app.get("/customers", (req, res) => {
  customerDB.find({}, (err, docs) => {
    if (err) return res.status(500).send(err);
    res.json(docs);
  });
});

// add customer
app.post("/customers", (req, res) => {
  customerDB.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).send(err);
    res.json(newDoc);
  });
});

// DELETE /customers/:id
app.delete("/customers/:id", (req, res) => {
  customerDB.remove({ _id: String(req.params.id) }, {}, (err, numRemoved) => {
    if (err) return res.status(500).send(err);
    if (numRemoved === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted", id: req.params.id });
  });
});

// UPDATE /customers/:id
app.put("/customers/:id", (req, res) => {
  customerDB.update({ _id: String(req.params.id) },{ $set: req.body },{},(err, numUpdated) => {
      if (err) return res.status(500).send(err);
      if (numUpdated === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer updated", id: req.params.id });
    }
  );
});

app.listen(3000, () =>
  console.log("NeDB API running at http://localhost:3000")
);
