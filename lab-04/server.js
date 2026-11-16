const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database', 'users.db');
const JWT_SECRET = 'lab_04_secret_key_change_in_production';

app.use(express.json());

let db;

async function initializeDatabase() {
  try {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);

    console.log('Connected to SQLite database at:', DB_PATH);
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Lab 4 Server is running: Registration, Login and JWT API',
  });
});

app.post('/register/', async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      return res.status(400).json({
        error: 'Username, name, and password are required',
      });
    }

    const existingUser = await db.get(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      'INSERT INTO user (username, name, password) VALUES (?, ?, ?)',
      [username, name, hashedPassword]
    );

    return res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({
      error: 'Internal server error during registration',
    });
  }
});

app.post('/login/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    const dbUser = await db.get(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    if (!dbUser) {
      return res.status(400).json({
        error: 'Invalid user',
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        error: 'Invalid password',
      });
    }

    const payload = {
      username: dbUser.username,
    };

    const jwtToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      jwt_token: jwtToken,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      error: 'Internal server error during login',
    });
  }
});

initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
