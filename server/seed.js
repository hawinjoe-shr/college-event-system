const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');

dotenv.config();

const sampleEvents = [
  {
    title: "Annual Tech Symposium 2026",
    category: "Technical",
    date: "2026-11-15",
    location: "Main Auditorium",
    description: "Join us for hackathons, paper presentations, and tech talks from industry leaders.",
    capacity: 150,
    registrationsCount: 42
  },
  {
    title: "Cultural Fest - Waves",
    category: "Cultural",
    date: "2026-11-20",
    location: "College Open Amphitheater",
    description: "A day filled with music, dance, drama, and art competitions across departments.",
    capacity: 300,
    registrationsCount: 120
  },
  {
    title: "Inter-College Cricket Tournament",
    category: "Sports",
    date: "2026-12-05",
    location: "College Sports Ground",
    description: "Cheer for your team as colleges battle it out for the ultimate championship trophy.",
    capacity: 80,
    registrationsCount: 16
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Event.deleteMany({});
    await Event.insertMany(sampleEvents);
    console.log("Database seeded successfully with sample events!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();