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

//mongodb://localhost:27017/your_database_name
//process.env.MONGODB_URI
mongoose
  .connect("mongodb://localhost:27017/OrderReports")
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
  { collection: "CheckedOrders" }
);

// Create the Item model based on the schema
const Item = mongoose.model("Item", itemSchema);

// API routes
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Error fetching items" }); // Return JSON
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
