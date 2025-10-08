const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Home page (form)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Register user + generate QR code
router.post('/register', async (req, res) => {
  try {
    const { name, bloodGroup, allergies, emergencyContact } = req.body;
    const newUser = new User({ name, bloodGroup, allergies, emergencyContact });
    await newUser.save();

    // Create QR Code
    const profileURL = `http://localhost:3000/user/${newUser._id}`;
    const qrPath = `public/qr_codes/${newUser._id}.png`;

    await QRCode.toFile(qrPath, profileURL);
    newUser.qrCodePath = `/qr_codes/${newUser._id}.png`;
    await newUser.save();

    res.send(`
      <h2>✅ QR Code Generated Successfully!</h2>
      <img src="${newUser.qrCodePath}" width="200" />
      <p>Scan this QR code to view your emergency info.</p>
      <a href="/">Register Another</a>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user record.");
  }
});

// View user info (after scanning QR)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("User not found!");

    // Serve dynamic HTML (no EJS)
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Emergency Info - ${user.name}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h2>🚑 Emergency Medical Information</h2>
        <div class="card">
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Blood Group:</strong> ${user.bloodGroup}</p>
          <p><strong>Allergies:</strong> ${user.allergies || 'None'}</p>
          <p><strong>Emergency Contact:</strong> ${user.emergencyContact}</p>
        </div>
        <br>
        <img src="${user.qrCodePath}" width="150" />
        <p><em>Scan to verify medical details</em></p>
      </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading user profile.");
  }
});

module.exports = router;
