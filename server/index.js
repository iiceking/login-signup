const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB - Assurez-vous que l'URL est correcte
mongoose.connect("mongodb://localhost:27017/myDatabase")
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Failed to connect to DB", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error creating user", error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.send({ message: "Logged in successfully" });
    } else {
      res.status(400).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// Define reservation schema
const reservationSchema = new mongoose.Schema({
  date: String,
  room: String,
  startHour: Number,
  endHour: Number
});

// Create reservation model
const Reservation = mongoose.model('Reservation', reservationSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Endpoint to handle reservation requests
app.post('/api/reserve', async (req, res) => {
  const { date, startHour, endHour, room } = req.body;

  try {
    // Check if the requested time slot is available
    const isAvailable = await isSlotAvailable(date, startHour, endHour, room);
    console.log(isAvailable);
    if (isAvailable) {
      // Create a new reservation
      console.log("a");
      const newReservation = new Reservation({
        date,
        room,
        startHour,
        endHour,
      });

      // Save the reservation to the database
      await newReservation.save();

      res.json({ success: true, message: 'Reservation confirmed!' });
    } else {
        console.log("b");
      res.json({ success: false, message: 'The selected time slot is not available. Please choose another one.' });
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
  }
});

// Function to check if a time slot is available
async function isSlotAvailable(date, startHour, endHour,room) {
  // Check if the slot overlaps with any existing reservations
  const existingReservations = await Reservation.find({
    date,
    room,
    $or: [
      { startHour: { $lt: endHour }, endHour: { $gt: startHour } }, // Check if the startHour is before endHour and endHour is after startHour
      { startHour: { $gte: startHour, $lt: endHour } }, // Check if the startHour is between startHour and endHour
      { endHour: { $gt: startHour, $lte: endHour } } // Check if the endHour is between startHour and endHour
    ]
  });
  console.log(existingReservations);
  return existingReservations.length === 0;
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});