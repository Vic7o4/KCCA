const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Static data
const events = [
  {
    id: 1,
    title: 'Kiambu County Chess Championship 2024',
    date: '2024-06-15',
    location: 'Kiambu Town Hall',
    description: 'Annual championship event featuring players from across the county competing for the prestigious title.',
    registration_deadline: '2024-06-10',
    poster_url: null
  },
  {
    id: 2,
    title: 'Youth Chess Workshop',
    date: '2024-05-25',
    location: 'Thika Community Center',
    description: 'Special training session for young players aged 8-16, featuring instruction from experienced coaches.',
    registration_deadline: '2024-05-20',
    poster_url: null
  }
];

const news = [
  {
    id: 1,
    title: 'Kiambu Chess Prodigy Wins National Championship',
    content: '14-year-old Sarah Muthoni from Kiambu makes history as the youngest national chess champion. Her remarkable journey from local chess clubs to national recognition inspires young players across the country.',
    category: 'Achievements',
    image_url: null,
    created_at: '2024-04-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'KCCA Launches School Chess Program',
    content: 'The Kiambu County Chess Association has partnered with the Department of Education to launch an ambitious chess program in local schools.',
    category: 'Community',
    image_url: null,
    created_at: '2024-04-10T14:30:00Z'
  }
];

const gallery = [
  {
    id: 1,
    image_url: '/images/chess-tournament-1.jpg',
    category: 'Tournaments',
    caption: 'County Championship Finals 2024',
    created_at: '2024-04-01T09:15:00Z'
  },
  {
    id: 2,
    image_url: '/images/youth-training.jpg',
    category: 'Training',
    caption: 'Youth Training Camp',
    created_at: '2024-03-25T11:20:00Z'
  }
];

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

// In-memory data storage
let eventIdCounter = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
let newsIdCounter = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;
let galleryIdCounter = gallery.length > 0 ? Math.max(...gallery.map(g => g.id)) + 1 : 1;

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
// Events endpoints
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

app.post('/api/admin/events', authenticateToken, upload.single('poster'), (req, res) => {
  try {
    const { title, date, location, description, registrationDeadline } = req.body;
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newEvent = {
      id: eventIdCounter++,
      title,
      date,
      location,
      description,
      registration_deadline: registrationDeadline,
      poster_url: posterUrl,
      created_at: new Date().toISOString()
    };
    
    events.push(newEvent);
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// News endpoints
app.get('/api/news', (req, res) => {
  res.json(news);
});

app.get('/api/news/:id', (req, res) => {
  const newsItem = news.find(n => n.id === parseInt(req.params.id));
  if (!newsItem) return res.status(404).json({ message: 'News item not found' });
  res.json(newsItem);
});

app.post('/api/admin/news', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newsItem = {
      id: newsIdCounter++,
      title,
      content,
      category,
      image_url: imageUrl,
      created_at: new Date().toISOString()
    };
    
    news.push(newsItem);
    res.status(201).json({
      message: 'News created successfully',
      news: newsItem
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Failed to create news' });
  }
});

// Gallery endpoints
app.get('/api/gallery', (req, res) => {
  res.json(gallery);
});

app.get('/api/gallery/:id', (req, res) => {
  const galleryItem = gallery.find(g => g.id === parseInt(req.params.id));
  if (!galleryItem) return res.status(404).json({ message: 'Gallery item not found' });
  res.json(galleryItem);
});

app.post('/api/admin/gallery', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { category, caption } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    const galleryItem = {
      id: galleryIdCounter++,
      image_url: imageUrl,
      category,
      caption,
      created_at: new Date().toISOString()
    };
    
    gallery.push(galleryItem);
    res.status(201).json({
      message: 'Image uploaded successfully',
      item: galleryItem
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
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
