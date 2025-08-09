-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kiambu_chess;

-- Switch to the database
USE kiambu_chess;

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  registration_deadline DATE,
  poster_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample tournament data
INSERT INTO tournaments (title, date, location, description, registration_deadline, poster_url) 
VALUES 
('Kiambu County Chess Championship 2024', '2024-06-15', 'Kiambu Town Hall', 'Annual championship event featuring players from across the county competing for the prestigious title.', '2024-06-10', NULL),
('Youth Chess Workshop', '2024-05-25', 'Thika Community Center', 'Special training session for young players aged 8-16, featuring instruction from experienced coaches.', '2024-05-20', NULL),
('Rapid Chess Tournament', '2024-07-08', 'Limuru Sports Complex', 'One-day rapid chess tournament with multiple rounds. Open to all skill levels.', '2024-07-01', NULL);

-- Insert sample news data
INSERT INTO news (title, content, category, image_url) 
VALUES 
('Kiambu Chess Prodigy Wins National Championship', '14-year-old Sarah Muthoni from Kiambu makes history as the youngest national chess champion. Her remarkable journey from local chess clubs to national recognition inspires young players across the country.', 'Achievements', NULL),
('KCCA Launches School Chess Program', 'The Kiambu County Chess Association has partnered with the Department of Education to launch an ambitious chess program in local schools. The initiative will provide chess equipment, training materials, and professional coaching to participating schools.', 'Community', NULL),
('International Master to Host Training Camp', 'International Master David Kamau, Kiambu\'s highest-rated player, will conduct an intensive training camp this summer. The program will cover advanced positional play, endgame techniques, and psychological preparation for tournaments.', 'Training', NULL);

-- Insert sample gallery data
INSERT INTO gallery (image_url, category, caption) 
VALUES 
('/uploads/sample1.jpg', 'Tournaments', 'County Championship Finals 2024'),
('/uploads/sample2.jpg', 'Training', 'Youth Training Camp'),
('/uploads/sample3.jpg', 'Community', 'Chess in the Park'); 