const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(express.json());
app.use(helmet());

app.use("/api", require("./routers/customersRouters"));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err });
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
