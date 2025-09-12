const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", require("./routers/customersRouters"));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err });
});

app.listen(3000, () =>
  console.log("NeDB API running at http://localhost:3000")
);
