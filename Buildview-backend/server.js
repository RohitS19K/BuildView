// server.js (inside BuildView-backend)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Connect to MongoDB Atlas ---
mongoose
  .connect(
    "mongodb+srv://projectsbuildview:buildview123@buildview-cluster.gfd7tto.mongodb.net/?retryWrites=true&w=majority&appName=BuildView-Cluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- Schema & Model ---
const submissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Submission = mongoose.model("Submission", submissionSchema);

// --- Routes ---

// Test API
app.get("/", (req, res) => {
  res.send("🚀 BuildView Backend is running!");
});

// Contact Form Submission
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newSubmission = new Submission({ name, email, message });
    await newSubmission.save();
    res.status(200).json({ message: "✅ Submission saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error saving submission" });
  }
});

// Dashboard - Get all submissions
app.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ date: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching submissions" });
  }
});

// Simple Admin Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded for now (you can upgrade to real user DB later)
  if (username === "admin" && password === "buildview123") {
    res.json({ success: true, message: "✅ Login successful" });
  } else {
    res.status(401).json({ success: false, message: "❌ Invalid credentials" });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting contact', error });
  }
});


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const ADMIN_USER = { username: "admin", password: "admin123" }; // change later
const JWT_SECRET = "supersecret"; // store safely in .env

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER.username || password !== ADMIN_USER.password) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ success: true, token });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ success: false, message: "No token" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Protect dashboard API routes
app.get('/api/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contacts', error });
  }
});

app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting contact", error });
  }
});
