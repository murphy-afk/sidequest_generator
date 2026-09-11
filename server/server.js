const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
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


// Register User
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username already taken' });
        return res.status(500).json({ message: 'Database error' });
      }
      
      const userId = result.insertId;
      // Initialize profile
      db.query('INSERT INTO user_profiles (user_id, xp, level) VALUES (?, 0, 1)', [userId]);
      
      res.json({ message: 'User registered successfully', userId });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid username or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    // Fetch profile stats
    db.query('SELECT xp, level FROM user_profiles WHERE user_id = ?', [user.id], (err, profileResults) => {
      const profile = profileResults[0] || { xp: 0, level: 1 };
      res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, xp: profile.xp, level: profile.level }
      });
    });
  });
});

// Complete a Quest (Record history & update XP)
app.post('/api/complete-quest', (req, res) => {
  const { userId, questId, xpReward } = req.body;

  db.query('INSERT INTO completed_quests (user_id, quest_id) VALUES (?, ?)', [userId, questId], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to record completion' });

    // Update User XP
    db.query('SELECT xp, level FROM user_profiles WHERE user_id = ?', [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      let currentXp = results[0].xp + xpReward;
      let currentLevel = results[0].level;
      
      // Simple leveling algorithm: Every 100 XP = 1 Level
      let calculatedLevel = Math.floor(currentXp / 100) + 1;

      db.query('UPDATE user_profiles SET xp = ?, level = ? WHERE user_id = ?', [currentXp, calculatedLevel, userId], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to update XP' });
        res.json({ message: 'Quest completed', newXp: currentXp, newLevel: calculatedLevel });
      });
    });
  });
});

// Get User's Completed Quests History
app.get('/api/user-history/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT q.id, q.title, q.description, q.xp_reward, cq.completed_at 
    FROM completed_quests cq
    JOIN quests q ON cq.quest_id = q.id
    WHERE cq.user_id = ?
    ORDER BY cq.completed_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});