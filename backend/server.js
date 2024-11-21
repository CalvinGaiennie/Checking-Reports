const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/OrderReports", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

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
    res.status(500).send("Error fetching items");
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
