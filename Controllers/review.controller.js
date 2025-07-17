const Review = require("../Models/review.model");

// Create a new review
const createReview = async (req, res) => {
  try {
    const { productId, name, email, rating, message } = req.body;

    if (!productId || !name || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = await Review.create({
      productId,
      name,
      email,
      rating,
      message,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all reviews for a specific product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createReview,
  getProductReviews,
};
