const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// JWT Secret (should be stored in environment variables in production)
const JWT_SECRET = 'chesskenya_admin_secret_2025';

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'kiambuchess@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_app_password' // In production, use environment variables
  }
});

// Function to send confirmation email
const sendConfirmationEmail = async (userEmail, eventDetails, registrationDetails, paymentDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'kiambuchess@gmail.com',
      to: userEmail,
      subject: `Registration Confirmed - ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">Registration Confirmation</h2>
          <p>Dear ${registrationDetails.name},</p>
          <p>Your registration for ${eventDetails.title} has been confirmed. Your payment has been received.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4a90e2; margin-top: 0;">Event Details:</h3>
            <p><strong>Date:</strong> ${eventDetails.date}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4a90e2; margin-top: 0;">Registration Details:</h3>
            <p><strong>Name:</strong> ${registrationDetails.name}</p>
            <p><strong>Club/School:</strong> ${registrationDetails.affiliation}</p>
            <p><strong>Age:</strong> ${registrationDetails.age}</p>
            <p><strong>Phone:</strong> ${registrationDetails.phone}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4a90e2; margin-top: 0;">Payment Details:</h3>
            <p><strong>Amount Paid:</strong> KES ${paymentDetails.amount}</p>
            <p><strong>Transaction Reference:</strong> ${paymentDetails.mpesaReference}</p>
            <p><strong>Payment Date:</strong> ${new Date(paymentDetails.paymentDate).toLocaleString()}</p>
          </div>
          
          <p>Please keep this email for your records. You may be required to show it at the event.</p>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>Kiambu County Chess Association</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Create SQLite database and connection
const db = new sqlite3.Database('kiambu_chess.db');

// Helper function for executing queries
const query = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Query error:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Create tables if they don't exist
const createTables = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      category TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL,
      caption TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date DATE NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      registration_deadline DATE,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT,
      email TEXT,
      phone TEXT,
      bio TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (registration_id) REFERENCES registrations(id)
    );
  `;

  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
        reject(err);
      } else {
        console.log('Database tables created successfully');
        resolve();
      }
    });
  });
};

// Initialize database
createTables();

// News endpoints
app.post('/api/admin/news', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const results = await query(
      'INSERT INTO news (title, content, category, image_url) VALUES (?, ?, ?, ?)',
      [title, content, category, imageUrl]
    );

    res.status(201).json({ 
      message: 'News article created',
      id: results.insertId
    });
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ 
      message: 'Failed to create news article',
      error: error.message
    });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const { category } = req.query;
    const sqlQuery = category
      ? 'SELECT * FROM news WHERE category = ? ORDER BY created_at DESC'
      : 'SELECT * FROM news ORDER BY created_at DESC';
    const params = category ? [category] : [];

    const results = await query(sqlQuery, params);
    res.json(results);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      message: 'Failed to fetch news',
      error: error.message
    });
  }
});

// Event endpoints
app.post('/api/admin/events', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, date, location, description, registrationDeadline } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const results = await query(
      'INSERT INTO events (title, date, location, description, registration_deadline, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, date, location, description, registrationDeadline, imageUrl]
    );

    res.status(201).json({ 
      message: 'Event created successfully',
      eventId: results.insertId
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      message: 'Failed to create event',
      error: error.message
    });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const results = await query('SELECT * FROM events ORDER BY date ASC');
    res.json(results);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // For now, we'll use hardcoded admin credentials (in production, these should be in a database)
    const ADMIN_CREDENTIALS = {
      username: 'admin',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4V87jt2CbG..3oq/eA0NWx4V87jt2CbG..3oq/eA0NWx' // bcrypt hash of 'admin123'
    };

    // Verify credentials
    if (username === ADMIN_CREDENTIALS.username && bcrypt.compareSync(password, ADMIN_CREDENTIALS.password)) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ 
        token,
        user: { username }
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid credentials',
        error: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Gallery endpoints
app.post('/api/admin/gallery', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { category, caption } = req.body;
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No image uploaded',
        error: 'Please upload an image'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const results = await query(
      'INSERT INTO gallery (image_url, category, caption) VALUES (?, ?, ?)',
      [imageUrl, category, caption]
    );

    res.status(201).json({ 
      message: 'Image uploaded successfully',
      id: results.insertId
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const { category } = req.query;
    const sqlQuery = category
      ? 'SELECT * FROM gallery WHERE category = ? ORDER BY created_at DESC'
      : 'SELECT * FROM gallery ORDER BY created_at DESC';
    const params = category ? [category] : [];

    const results = await query(sqlQuery, params);
    res.json(results);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ 
      message: 'Failed to fetch gallery',
      error: error.message
    });
  }
});

// Payment summary endpoint
app.get('/api/payments/summary', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        e.event_name,
        COUNT(p.id) as total_payments,
        SUM(p.amount) as total_amount,
        COUNT(CASE WHEN p.payment_status = 'completed' THEN 1 END) as completed_payments,
        SUM(CASE WHEN p.payment_status = 'completed' THEN p.amount ELSE 0 END) as collected_amount
      FROM event_registrations e
      LEFT JOIN payments p ON e.id = p.registration_id
      GROUP BY e.event_name
    `;

    const results = await query(query);
    res.json(results);
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ 
      message: 'Failed to fetch payment summary',
      error: error.message
    });
  }
});

// Add endpoint for resending confirmation emails
app.post('/api/admin/resend-confirmation/:registrationId', authenticateToken, async (req, res) => {
  const { registrationId } = req.params;

  try {
    const query = 'SELECT r.*, p.amount, p.mpesa_reference, p.payment_date FROM event_registrations r JOIN payments p ON r.id = p.registration_id WHERE r.id = ? AND p.payment_status = "completed"';

    const results = await query(query, [registrationId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Registration or payment not found' });
    }

    const registration = results[0];

    const eventDetails = {
      title: registration.event_name,
      date: registration.event_date,
      location: registration.event_location
    };

    const registrationDetails = {
      name: registration.name,
      affiliation: registration.affiliation,
      age: registration.age,
      phone: registration.phone
    };

    const paymentDetails = {
      amount: registration.amount,
      mpesaReference: registration.mpesa_reference,
      paymentDate: registration.payment_date
    };

    await sendConfirmationEmail(
      registration.email,
      eventDetails,
      registrationDetails,
      paymentDetails
    );

    res.json({ message: 'Confirmation email resent successfully' });
  } catch (error) {
    console.error('Error resending confirmation:', error);
    res.status(500).json({ message: 'Failed to resend confirmation email' });
  }
});

// Export the app for testing
module.exports = {
  app
};

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server initialization complete');
});

// End of file 