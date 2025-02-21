import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';  // Add this line at the top of your App.js


function App() {
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const [error, setError] = useState(null);  // New state for errors

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const time_needed = document.getElementById('time_needed').value;
    const difficulty = document.getElementById('difficulty').value;

    const newStudyPlan = {
      subject: subject,
      time_needed: time_needed,
      difficulty: difficulty,
    };

    // Send POST request to add study plan
    axios
      .post('http://localhost:3000/add_study_plan', newStudyPlan)
      .then((response) => {
        console.log('Study Plan Added:', response.data);
        document.getElementById('studyPlanForm').reset();
        fetchStudyPlans(); // Reload the study plans
      })
      .catch((error) => {
        console.error('Error adding study plan:', error);
      });
  };

  // Fetch study plans from the backend
  const fetchStudyPlans = () => {
    setLoading(true);  // Start loading
    axios
      .get('http://localhost:3000/get_study_plans')
      .then((response) => {
        // Check if the response is an array, otherwise set it as an empty array
        setStudyPlans(Array.isArray(response.data) ? response.data : []);
        setLoading(false);  // End loading
      })
      .catch((error) => {
        console.error('Error fetching study plans:', error);
        setError('Failed to load study plans');  // Set error message
        setLoading(false);  // End loading
      });
  };

  useEffect(() => {
    fetchStudyPlans(); // Fetch study plans when the component mounts
  }, []);

  return (
    <div className="App">
      <h1>Studbud - Study Planner</h1>

      {/* Form to add a study plan */}
      <form id="studyPlanForm" onSubmit={handleFormSubmit}>
        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" name="subject" required />

        <label htmlFor="time_needed">Time Needed:</label>
        <input type="text" id="time_needed" name="time_needed" required />

        <label htmlFor="difficulty">Difficulty:</label>
        <select id="difficulty" name="difficulty">
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button type="submit">Add Study Plan</button>
      </form>

      {/* Loading state */}
      {loading && <p>Loading study plans...</p>}

      {/* Error state */}
      {error && <p>{error}</p>}

      {/* Render study plans */}
      <h2>Existing Study Plans</h2>
      <ul id="studyPlanList">
        {/* Check if studyPlans is an array and has data */}
        {Array.isArray(studyPlans) && studyPlans.length > 0 ? (
          studyPlans.map((plan, index) => (
            <li key={index}>
              {plan.subject} - {plan.time_needed} - {plan.difficulty}
            </li>
          ))
        ) : (
          <p>No study plans available.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
