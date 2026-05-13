const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    seedEvents();
  })
  .catch((err) => console.error("MongoDB Error:", err));

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Seed Sample Events
const Event = require("./models/Event");

async function seedEvents() {
  const count = await Event.countDocuments();

  if (count === 0) {
    await Event.insertMany([
      {
        title: "Web Development Bootcamp",
        date: "2025-02-15",
        location: "Mumbai",
        seats: 50,
        description: "A 2-day intensive bootcamp on modern web development.",
      },
      {
        title: "AI & ML Workshop",
        date: "2025-02-22",
        location: "Pune",
        seats: 30,
        description: "Hands-on workshop on machine learning fundamentals.",
      },
      {
        title: "Cloud Computing Summit",
        date: "2025-03-05",
        location: "Bangalore",
        seats: 100,
        description: "Learn AWS, Azure, and GCP from industry experts.",
      },
    ]);

    console.log("Sample events seeded");
  }
}

// Serve React Frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// React Routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Server Port
const PORT = process.env.PORT || 5002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});