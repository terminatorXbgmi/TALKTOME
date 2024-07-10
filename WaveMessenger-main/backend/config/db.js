
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_DB_URL = process.env.MONGO_URI;
console.log(MONGO_DB_URL);
mongoose.connect(String(MONGO_DB_URL));

const db = mongoose.connection; // Removed unnecessary parentheses

db.on("connected", () => {
  console.log(`MONGODB Connected: ${db.host}`); // Used 'db.host' instead of 'db.connection.host'
});

db.on("error", (error) => {
  // Added 'error' parameter to the error event handler
  console.log(`Error: ${error.message}`); // Used 'error.message' instead of 'db.error.message'
});

module.exports = db;
