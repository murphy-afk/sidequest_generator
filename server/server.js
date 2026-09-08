const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as ID ' + connection.threadId);
  connection.release();
});

// API Endpoint to generate a quest dynamically using SQL filters
app.post('/api/generate-quest', (req, res) => {
  const { canLeaveHouse, budget, locationType, adventurousness } = req.body;

  // Build dynamic SQL query based on filters
  let query = 'SELECT * FROM quests WHERE can_leave_house = ? AND budget <= ? AND adventurousness <= ?';
  let queryParams = [canLeaveHouse, budget, adventurousness];

  if (locationType && locationType !== 'any') {
    query += ' AND location_type = ?';
    queryParams.push(locationType);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No quests match your exact criteria. Try broadening your parameters!' });
    }

    // Pick a random quest from the returned rows
    const randomQuest = results[Math.floor(Math.random() * results.length)];
    
    // Format column names back to camelCase for the frontend
    const formattedQuest = {
      id: randomQuest.id,
      title: randomQuest.title,
      description: randomQuest.description,
      canLeaveHouse: randomQuest.can_leave_house,
      budget: randomQuest.budget,
      locationType: randomQuest.location_type,
      adventurousness: randomQuest.adventurousness,
      xpReward: randomQuest.xp_reward
    };

    res.json(formattedQuest);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));