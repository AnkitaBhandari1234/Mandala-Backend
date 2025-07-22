const express = require("express");
const router = express.Router();
const { initEsewa } = require("../Controllers/esewa.controller");

router.post("/payment/init-esewa", initEsewa);

module.exports = router;
