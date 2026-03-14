-- =====================================================
-- Masakali Restaurant Group - Database Schema
-- =====================================================

CREATE DATABASE IF NOT EXISTS masakali_ottawa;
USE masakali_ottawa;

-- =====================================================
-- Restaurants Table
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  brand VARCHAR(100) NOT NULL DEFAULT 'Masakali Indian Cuisine',
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province_state VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'Canada',
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  google_maps_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  opening_hours JSON,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Reservations Table
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  persons INT NOT NULL,
  special_requests TEXT,
  geolocation_latitude DECIMAL(10, 8),
  geolocation_longitude DECIMAL(11, 8),
  geolocation_accuracy_meters DECIMAL(10, 2),
  geolocation_captured_at DATETIME,
  geolocation_source VARCHAR(50),
  request_ip VARCHAR(45),
  request_user_agent TEXT,
  request_browser VARCHAR(120),
  request_os VARCHAR(120),
  request_device_type VARCHAR(30),
  ip_lookup_status VARCHAR(20),
  ip_lookup_message VARCHAR(255),
  ip_country VARCHAR(100),
  ip_region VARCHAR(100),
  ip_city VARCHAR(100),
  ip_zip VARCHAR(20),
  ip_latitude DECIMAL(10, 8),
  ip_longitude DECIMAL(11, 8),
  ip_timezone VARCHAR(80),
  ip_isp VARCHAR(150),
  ip_org VARCHAR(150),
  ip_as VARCHAR(150),
  ip_mobile BOOLEAN,
  ip_proxy BOOLEAN,
  ip_hosting BOOLEAN,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
  confirmation_code VARCHAR(20) UNIQUE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- =====================================================
-- Catering Requests Table
-- =====================================================
CREATE TABLE IF NOT EXISTS catering_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  event_date DATE NOT NULL,
  guests INT NOT NULL,
  event_location VARCHAR(500),
  event_type VARCHAR(100),
  budget_range VARCHAR(50),
  notes TEXT,
  request_ip VARCHAR(45),
  request_user_agent TEXT,
  request_browser VARCHAR(120),
  request_os VARCHAR(120),
  request_device_type VARCHAR(30),
  ip_lookup_status VARCHAR(20),
  ip_lookup_message VARCHAR(255),
  ip_country VARCHAR(100),
  ip_region VARCHAR(100),
  ip_city VARCHAR(100),
  ip_zip VARCHAR(20),
  ip_latitude DECIMAL(10, 8),
  ip_longitude DECIMAL(11, 8),
  ip_timezone VARCHAR(80),
  ip_isp VARCHAR(150),
  ip_org VARCHAR(150),
  ip_as VARCHAR(150),
  ip_mobile BOOLEAN,
  ip_proxy BOOLEAN,
  ip_hosting BOOLEAN,
  status ENUM('new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Contact Inquiries Table
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  restaurant_id INT,
  request_ip VARCHAR(45),
  request_user_agent TEXT,
  request_browser VARCHAR(120),
  request_os VARCHAR(120),
  request_device_type VARCHAR(30),
  ip_lookup_status VARCHAR(20),
  ip_lookup_message VARCHAR(255),
  ip_country VARCHAR(100),
  ip_region VARCHAR(100),
  ip_city VARCHAR(100),
  ip_zip VARCHAR(20),
  ip_latitude DECIMAL(10, 8),
  ip_longitude DECIMAL(11, 8),
  ip_timezone VARCHAR(80),
  ip_isp VARCHAR(150),
  ip_org VARCHAR(150),
  ip_as VARCHAR(150),
  ip_mobile BOOLEAN,
  ip_proxy BOOLEAN,
  ip_hosting BOOLEAN,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

-- =====================================================
-- Homepage Featured Dishes
-- =====================================================
CREATE TABLE IF NOT EXISTS homepage_featured_dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_key VARCHAR(120) NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_menu_item_key (menu_item_key)
);

-- =====================================================
-- Testimonials
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  branch VARCHAR(255) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Admins Table
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'branch_admin', 'staff') DEFAULT 'staff',
  restaurant_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

-- =====================================================
-- Email Notification Settings
-- =====================================================
CREATE TABLE IF NOT EXISTS email_notification_settings (
  id TINYINT PRIMARY KEY,
  reservations_email VARCHAR(255) DEFAULT NULL,
  contact_email VARCHAR(255) DEFAULT NULL,
  catering_email VARCHAR(255) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO email_notification_settings (id, reservations_email, contact_email, catering_email)
VALUES (1, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE id = id;

-- =====================================================
-- Seed Data: Restaurants
-- =====================================================
INSERT INTO restaurants (name, slug, brand, address, city, province_state, country, phone, email, website) VALUES
('Masakali Indian Cuisine - Stittsville', 'stittsville', 'Masakali Indian Cuisine', '5507 Hazeldean Rd Unit C3-1, Stittsville, ON K2S 0P5', 'Stittsville', 'Ontario', 'Canada', '6138783939', 'stittsville@masakali.ca', 'https://masakaliottawa.ca'),
('Masakali Indian Cuisine - Wellington', 'wellington', 'Masakali Indian Cuisine', '1111 Wellington St. W, Ottawa, ON K1Y 1P1', 'Ottawa', 'Ontario', 'Canada', '6137929777', 'wellington@masakali.ca', 'https://masakaliottawa.ca'),
('Masakali Indian Resto Bar - Byward Market', 'restobar', 'Masakali Indian Resto Bar', '97 Clarence St., Ottawa, ON K1N 5P9', 'Ottawa', 'Ontario', 'Canada', '6137896777', 'info@masakalirestrobar.ca', 'https://masakalirestrobar.ca'),
('RangDe Indian Cuisine - Kanata', 'rangde', 'RangDe Indian Cuisine', '700 March Rd Unit H, Kanata, ON K2K 2V9', 'Kanata', 'Ontario', 'Canada', '6135950777', 'info@rangdeottawa.com', 'https://rangdeottawa.com'),
('Masakali Indian Cuisine - Montreal', 'montreal', 'Masakali Indian Cuisine', '1015 Sherbrooke St W, Montreal, Quebec H3A 1G5', 'Montreal', 'Quebec', 'Canada', '5142286777', 'montreal@masakali.ca', 'https://masakalimontreal.ca'),
('Masakali Indian Cuisine - California', 'california', 'Masakali Indian Cuisine', '10310 S De Anza Blvd, Cupertino, CA 95014, United States', 'Cupertino', 'California', 'USA', '0000000000', 'admin@masakalicalifornia.com', 'https://masakalicalifornia.com');

-- =====================================================
-- Seed Data: Default Admin
-- Password: Masakali$2026 (bcrypt hash)
-- =====================================================
INSERT INTO admins (name, email, password_hash, role) VALUES
('Super Admin', 'admin@masakalicalifornia.com', '$2a$10$MjWi2ZLIvxJKPD8wOfzRfOUOPAYKWVZbnIzeOXjPJab3yyp1UGefm', 'super_admin');

-- =====================================================
-- Migration: Add Reservation Geolocation Columns
-- Run on existing databases where reservations table already exists.
-- =====================================================
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS geolocation_latitude DECIMAL(10, 8) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS geolocation_longitude DECIMAL(11, 8) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS geolocation_accuracy_meters DECIMAL(10, 2) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS geolocation_captured_at DATETIME NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS geolocation_source VARCHAR(50) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS request_ip VARCHAR(45) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS request_user_agent TEXT NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS request_browser VARCHAR(120) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS request_os VARCHAR(120) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS request_device_type VARCHAR(30) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_lookup_status VARCHAR(20) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_lookup_message VARCHAR(255) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_country VARCHAR(100) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_region VARCHAR(100) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_city VARCHAR(100) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_zip VARCHAR(20) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_latitude DECIMAL(10, 8) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_longitude DECIMAL(11, 8) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_timezone VARCHAR(80) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_isp VARCHAR(150) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_org VARCHAR(150) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_as VARCHAR(150) NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_mobile BOOLEAN NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_proxy BOOLEAN NULL;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS ip_hosting BOOLEAN NULL;

ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS request_ip VARCHAR(45) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS request_user_agent TEXT NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS request_browser VARCHAR(120) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS request_os VARCHAR(120) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS request_device_type VARCHAR(30) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_lookup_status VARCHAR(20) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_lookup_message VARCHAR(255) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_country VARCHAR(100) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_region VARCHAR(100) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_city VARCHAR(100) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_zip VARCHAR(20) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_latitude DECIMAL(10, 8) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_longitude DECIMAL(11, 8) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_timezone VARCHAR(80) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_isp VARCHAR(150) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_org VARCHAR(150) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_as VARCHAR(150) NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_mobile BOOLEAN NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_proxy BOOLEAN NULL;
ALTER TABLE catering_requests ADD COLUMN IF NOT EXISTS ip_hosting BOOLEAN NULL;

ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS request_ip VARCHAR(45) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS request_user_agent TEXT NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS request_browser VARCHAR(120) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS request_os VARCHAR(120) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS request_device_type VARCHAR(30) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_lookup_status VARCHAR(20) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_lookup_message VARCHAR(255) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_country VARCHAR(100) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_region VARCHAR(100) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_city VARCHAR(100) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_zip VARCHAR(20) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_latitude DECIMAL(10, 8) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_longitude DECIMAL(11, 8) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_timezone VARCHAR(80) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_isp VARCHAR(150) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_org VARCHAR(150) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_as VARCHAR(150) NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_mobile BOOLEAN NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_proxy BOOLEAN NULL;
ALTER TABLE contact_inquiries ADD COLUMN IF NOT EXISTS ip_hosting BOOLEAN NULL;

CREATE TABLE IF NOT EXISTS homepage_featured_dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_key VARCHAR(120) NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_menu_item_key (menu_item_key)
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  branch VARCHAR(255) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
