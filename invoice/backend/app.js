const express = require("express");
const cors = require("cors");
const { customerDB, productDB } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// --- Müşteri CRUD ---
app.get("/customers", (req, res) => {
  customerDB.find({}, (err, docs) => {
    if (err) return res.status(500).send(err);
    res.json(docs);
  });
});

app.post("/customers", (req, res) => {
  customerDB.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).send(err);
    res.json(newDoc);
  });
});

// --- Ürün CRUD ---
app.get("/products", (req, res) => {
  productDB.find({}, (err, docs) => {
    if (err) return res.status(500).send(err);
    res.json(docs);
  });
});

app.post("/products", (req, res) => {
  productDB.insert(req.body, (err, newDoc) => {
    if (err) return res.status(500).send(err);
    res.json(newDoc);
  });
});

app.listen(3000, () =>
  console.log("NeDB API running at http://localhost:3000")
);
