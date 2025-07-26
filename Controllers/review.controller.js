const Review = require("../Models/review.model");

// Create a new review
const createReview = async (req, res) => {
  try {
    

    const { productId, name, email, rating, message ,date} = req.body;


    if (!productId || !name || !email || !rating || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // ✅ Check if this user (email) has already reviewed this product
    const existingReview = await Review.findOne({ productId, email });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already submitted a review for this product.",
      });
    }

    const review = await Review.create({
     productId,
      name,
      email,
      rating,
      message,
      date: date || new Date(),
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
