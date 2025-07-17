const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
} = require("../Controllers/review.controller");

// POST: Create review
router.post("/", createReview);

// GET: Get reviews for a product
router.get("/:productId", getProductReviews);

module.exports = router;
