const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('.path/to/serviceAccountKey.json')),  // Correct path to the JSON file
  databaseURL: 'https://studbud-60d26-default-rtdb.asia-southeast1.firebasedatabase.app'  // Your Firebase Realtime Database URL
});

const db = admin.database(); // Correct method for Realtime Database

const app = express();
app.use(bodyParser.json());

// Export db to use in your server.js (if this code is in a separate module, for example)
module.exports = db;
