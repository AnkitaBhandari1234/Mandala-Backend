require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./Models/catagories.model");

const categories = [
  {
    category: "Decor",
    subcategories: ["Wall Hanging", "Lamps & Lanterns", "Cushions & Covers"],
  },
  {
    category:"Textiles",
    subcategories:["Shawls & Scarves","Cushion & Table Covers","Bedding & Throws"],

  },
  {
    category:"Jewelry",
    subcategories:["Necklaces","Earrings","Bracelets & Bangles"],
  },
  {
    category:"Ceramics",
    subcategories:["Mugs & Cups","Serving Bowls","Decorative Vases"],
  },
  {
    category:"Artifacts",
    subcategories:["Statues & Sculptures","Masks","Prayer Wheels & Bells"],
  },
  {
    category: "Wellness",
    subcategories: ["Incense & Burners", "Herbal Products"],
  },
  
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    await Category.deleteMany({});
    console.log("Existing categories deleted");

    await Category.insertMany(categories);
    console.log("Dummy categories added!");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding data:", err);
    await mongoose.disconnect();
  }
}

seedCategories();
