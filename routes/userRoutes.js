const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const QRCode = require('qrcode');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, bloodGroup, allergies, emergencyContact } = req.body;
    if (!name || !bloodGroup || !emergencyContact) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = new User({ name, bloodGroup, allergies, emergencyContact });
    await newUser.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const qrData = `${baseUrl}/user/${newUser._id}`;

    // Generate QR as base64
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    // Save QR URL in user model (optional)
    newUser.qrCodePath = qrCodeBase64;
    await newUser.save();

    res.status(201).json({
      message: "QR Code Generated Successfully!",
      qrCodeUrl: qrCodeBase64,
      userId: newUser._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("<h2>User not found</h2>");
    }

    // Render simple HTML (for emergency QR scan view)
    res.send(`
      <html>
        <head>
          <title>Emergency Info</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .card { max-width: 400px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
            h2 { color: #c0392b; text-align: center; }
            p { font-size: 16px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🚑 Emergency Medical Info</h2>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Blood Group:</strong> ${user.bloodGroup}</p>
            <p><strong>Allergies:</strong> ${user.allergies || "None"}</p>
            <p><strong>Emergency Contact:</strong> ${user.emergencyContact}</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).send("Server error.");
  }
});

module.exports = router;