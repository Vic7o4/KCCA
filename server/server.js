const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql2');

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kiambu123', // New password we just set
  database: 'kiambu_chess'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create tables if they don't exist
  const createTableStatements = [
    `CREATE TABLE IF NOT EXISTS tournaments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT,
      registration_deadline DATE,
      poster_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(50),
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(255) NOT NULL,
      category VARCHAR(50),
      caption TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  // Execute each create table statement separately
  for (const statement of createTableStatements) {
    db.query(statement, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Table created or verified successfully');
    });
  }
});

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (username === 'admin' && password === 'admin123') {
      console.log('Login successful');
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token });
    }

    console.log('Invalid credentials provided');
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Tournament endpoints
app.post('/api/admin/tournaments', authenticateToken, upload.single('poster'), (req, res) => {
  try {
    const { title, date, location, description, registrationDeadline } = req.body;
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO tournaments (title, date, location, description, registration_deadline, poster_url) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, date, location, description, registrationDeadline, posterUrl], (err, result) => {
      if (err) {
        console.error('Error creating tournament:', err);
        return res.status(500).json({ message: 'Failed to create tournament' });
      }
      res.status(201).json({
        message: 'Tournament created successfully',
        tournamentId: result.insertId
      });
    });
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ message: 'Failed to create tournament' });
  }
});

// Get all tournaments
app.get('/api/tournaments', (req, res) => {
  const query = 'SELECT * FROM tournaments ORDER BY date DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tournaments:', err);
      return res.status(500).json({ message: 'Failed to fetch tournaments' });
    }
    res.json(results);
  });
});

// News endpoints
app.post('/api/admin/news', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO news (title, content, category, image_url) VALUES (?, ?, ?, ?)';
    db.query(query, [title, content, category, imageUrl], (err, result) => {
      if (err) {
        console.error('Error creating news:', err);
        return res.status(500).json({ message: 'Failed to create news article' });
      }
      res.status(201).json({
        message: 'News article created successfully',
        newsId: result.insertId
      });
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Failed to create news article' });
  }
});

// Get all news
app.get('/api/news', (req, res) => {
  const query = 'SELECT * FROM news ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching news:', err);
      return res.status(500).json({ message: 'Failed to fetch news' });
    }
    res.json(results);
  });
});

// Gallery endpoints
app.post('/api/admin/gallery', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { category, caption } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO gallery (image_url, category, caption) VALUES (?, ?, ?)';
    db.query(query, [imageUrl, category, caption], (err, result) => {
      if (err) {
        console.error('Error creating gallery item:', err);
        return res.status(500).json({ message: 'Failed to add gallery item' });
      }
      res.status(201).json({
        message: 'Gallery item added successfully',
        galleryId: result.insertId
      });
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Failed to add gallery item' });
  }
});

// Get all gallery items
app.get('/api/gallery', (req, res) => {
  const query = 'SELECT * FROM gallery ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching gallery:', err);
      return res.status(500).json({ message: 'Failed to fetch gallery' });
    }
    res.json(results);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
