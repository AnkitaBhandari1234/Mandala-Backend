// backend/server.js
const express = require("express");
const app = express();
const path = require("path");

app.use("/ProductImages", express.static(path.join(__dirname, "ProductImages")));
