const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const BASE_URL = process.env.BASE_URL;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

//เพื่อให้สามารถรันหน้าเว็บได้ โดยที่รับ (req,res)มา
app.get("/", (req, res) => {
  res.send("<h1>ได้จ้า</h1>");
});

//Connect to Database

if (!DB_URL) {
  console.error("DB_URL");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Database Connect to MondoDB Success");
    })
    .catch((error) => {
      console.error("MongoDb Connect Error", error.message);
    });
}
