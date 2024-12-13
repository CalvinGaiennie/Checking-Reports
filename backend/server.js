const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB connection
const oldDb = "mongodb://localhost:27017/OrderReports";
const MONGODB_URI = process.env.MONGODB_URI;
mongoose;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Add event listeners for connection status
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection state: Connected (1)");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection state: Disconnected (0)");
});
// Define the item schema
const itemSchema = new mongoose.Schema(
  {
    OrderNumber: String,
    Date: String,
    OrderContent: String,
    OrderPuller: String,
    OrderStatus: String,
    OrderChecker: String,
    mistakeType: String, // If applicable
  },
  { collection: "Live-Orders" }
);

// Create the Item model based on the schema
const Item = mongoose.model("Item", itemSchema);

// API routes
app.get("/items", async (req, res) => {
  try {
    console.log("Attempting to fetch items from database...");
    const items = await Item.find();
    console.log(`Successfully fetched ${items.length} items`);
    res.json(items);
  } catch (err) {
    console.error("Detailed error:", err);
    res.status(500).json({
      error: "Error fetching items",
      details: err.message,
    });
  }
});
app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).send("Error saving item");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});
