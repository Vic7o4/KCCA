const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Create connection for database creation
const initialConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kiambu123' // New password we just set
});

// Read SQL file
const sqlFile = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');
const sqlStatements = sqlFile.split(';').filter(statement => statement.trim());

// Execute SQL statements
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Execute each SQL statement
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        await new Promise((resolve, reject) => {
          initialConnection.query(statement, (err) => {
            if (err) {
              console.error('Error executing statement:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    }

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase(); 