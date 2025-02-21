const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Make sure to require cors
const admin = require('firebase-admin');  // Firebase database

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),  // Path from 'server.js' to the file
  databaseURL: 'https://studbud-60d26-default-rtdb.asia-southeast1.firebasedatabase.app',
});


const db = admin.database();
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to add a study plan to Firebase
app.post('/add_study_plan', async (req, res) => {
  const { subject, time_needed, difficulty } = req.body;

  try {
    const newStudyPlan = {
      subject,
      time_needed,
      difficulty,
      created_at: new Date(),
    };

    // Add to Firestore collection
    await db.ref('study_plans').push(newStudyPlan);
    res.status(200).send({ message: 'Study plan added successfully!' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to get all study plans from Firebase
app.get('/get_study_plans', async (req, res) => {
  try {
    const snapshot = await db.ref('study_plans').once('value');  // .once('value') to read data from the node
    const studyPlans = snapshot.val();  // .val() to get the data
    res.status(200).json(studyPlans);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route for AI-powered study recommendations (using TensorFlow.js or other models)
app.post('/generate_study_schedule', async (req, res) => {
  const { subject, difficulty } = req.body;

  // AI logic goes here (for example, a TensorFlow.js model)
  // For now, simulate the AI response
  const schedule = {
    subject: subject || 'Math',
    time: '2 hours',
    recommendations: `Start with practice problems in ${subject}, then review theory.`,
  };

  res.status(200).json(schedule);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
