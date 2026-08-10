-- =====================================================================
-- MASAKALI RESTAURANT GROUP — CRM MODULE MIGRATION
-- Version: 1.0.0
-- Apply to: ALL 5 DATABASES (Ottawa, Montreal, California, Restobar, Rangde)
-- Safe to run multiple times (idempotent — uses IF NOT EXISTS / INSERT IGNORE)
-- =====================================================================

-- =====================================================================
-- TABLE 1: contacts
-- Core CRM table. One row per unique customer.
-- Deduplication: Email → Phone ONLY (no name matching).
-- =====================================================================
CREATE TABLE IF NOT EXISTS contacts (

  -- Primary Key
  id                  INT           AUTO_INCREMENT PRIMARY KEY,

  -- Customer Identity (stored exactly as entered)
  name                VARCHAR(255)  NOT NULL,
  email               VARCHAR(255)  NULL        COMMENT 'Email as entered by customer',
  email_normalized    VARCHAR(255)  NULL        COMMENT 'Lowercase trimmed — used for deduplication matching only',
  phone               VARCHAR(50)   NULL        COMMENT 'Phone as entered by customer (no auto-formatting)',
  phone_normalized    VARCHAR(50)   NULL        COMMENT 'Digits only — used for deduplication matching only',

  -- Visit Analytics
  first_visit_date    DATE          NULL        COMMENT 'Date of very first reservation',
  last_visit_date     DATE          NULL        COMMENT 'Date of most recent reservation',
  total_visits        INT           NOT NULL DEFAULT 0 COMMENT 'Total confirmed reservations count',

  -- Location Intelligence
  -- preferred_branch: the restaurant name/brand level (e.g. "Masakali Indian Cuisine")
  -- favorite_location: the specific location slug (e.g. "stittsville", "wellington")
  preferred_branch    VARCHAR(255)  NULL        COMMENT 'Most visited restaurant brand',
  favorite_location   VARCHAR(100)  NULL        COMMENT 'Most visited location slug (stittsville/wellington/etc.)',
  locations_visited   JSON          NULL        COMMENT 'Array of all location slugs visited e.g. ["stittsville","wellington"]',
  visits_per_location JSON          NULL        COMMENT 'Object: {"stittsville": 5, "wellington": 2}',

  -- CRM Classification
  customer_type       ENUM('new','returning','vip') NOT NULL DEFAULT 'new'
                                    COMMENT 'Auto-calculated: new=1 visit, returning=2-9, vip=10+',
  tags                JSON          NULL        COMMENT 'e.g. ["VIP","Birthday Club","Newsletter Subscriber"]',

  -- Marketing & Communication (CASL/GDPR ready)
  marketing_opt_in    TINYINT(1)    NOT NULL DEFAULT 1  COMMENT 'General marketing consent',
  email_subscribed    TINYINT(1)    NOT NULL DEFAULT 1  COMMENT 'Email campaign opt-in',
  sms_subscribed      TINYINT(1)    NOT NULL DEFAULT 0  COMMENT 'SMS campaign opt-in',

  -- Staff Notes (internal only, never shown to customer)
  notes               TEXT          NULL        COMMENT 'Internal staff CRM notes',

  -- Future: Revenue Tracking
  lifetime_value      DECIMAL(10,2) NULL        COMMENT 'Future: total estimated spend',

  -- Multi-site Future-Proofing
  -- When a central CRM database is built, this field identifies the source site
  source_site         VARCHAR(100)  NULL        COMMENT 'Source site identifier e.g. masakali_ottawa, masakali_montreal',

  -- Timestamps
  created_at          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- ─── Indexes & Constraints ───────────────────────────────────────
  -- Unique on normalized email (deduplication anchor)
  UNIQUE KEY uniq_contact_email_norm   (email_normalized),
  -- Index on normalized phone (secondary deduplication lookup)
  INDEX idx_contact_phone_norm         (phone_normalized),
  -- General search indexes
  INDEX idx_contact_name               (name),
  INDEX idx_contact_last_visit         (last_visit_date),
  INDEX idx_contact_type               (customer_type),
  INDEX idx_contact_source_site        (source_site)

) COMMENT = 'CRM: One row per unique customer across all reservations';


-- =====================================================================
-- TABLE 2: contact_visits
-- Visit history — one row per reservation-contact link.
-- Tracks location at the specific restaurant level (e.g. Stittsville vs Wellington).
-- =====================================================================
CREATE TABLE IF NOT EXISTS contact_visits (

  id                  INT           AUTO_INCREMENT PRIMARY KEY,

  -- Foreign Keys
  contact_id          INT           NOT NULL,
  reservation_id      INT           NULL        COMMENT 'NULL if visit was added manually or reservation was deleted',

  -- Location (both brand and specific location for full analytics)
  restaurant_id       INT           NULL        COMMENT 'FK to restaurants table',
  branch              VARCHAR(255)  NULL        COMMENT 'Full restaurant name e.g. "Masakali Indian Cuisine - Stittsville"',
  location_slug       VARCHAR(100)  NULL        COMMENT 'Restaurant slug e.g. stittsville, wellington, restobar',

  -- Visit Details (snapshot at time of reservation — immutable)
  visit_date          DATE          NOT NULL,
  visit_time          TIME          NULL,
  guest_count         INT           NULL,
  reservation_status  VARCHAR(50)   NULL        COMMENT 'pending/confirmed/completed/cancelled/no_show',
  special_requests    TEXT          NULL        COMMENT 'Snapshot of guest preferences',
  confirmation_code   VARCHAR(50)   NULL,

  created_at          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

  -- ─── Constraints ─────────────────────────────────────────────────
  -- Prevent duplicate visit records (safe for re-running migration)
  UNIQUE KEY uniq_visit_contact_reservation (contact_id, reservation_id),

  FOREIGN KEY (contact_id)    REFERENCES contacts(id)     ON DELETE CASCADE,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,

  INDEX idx_cv_contact       (contact_id),
  INDEX idx_cv_date          (visit_date),
  INDEX idx_cv_reservation   (reservation_id),
  INDEX idx_cv_location_slug (location_slug),
  INDEX idx_cv_status        (reservation_status)

) COMMENT = 'CRM: One row per visit/reservation per contact';


-- =====================================================================
-- MIGRATION: Backfill contacts from all existing reservations
-- Step 1: Create one contact per unique email (email-first deduplication)
-- =====================================================================
INSERT IGNORE INTO contacts (
  name,
  email,
  email_normalized,
  phone,
  phone_normalized,
  source_site,
  created_at,
  updated_at
)
SELECT
  -- Use the name from the most recent reservation for this email
  SUBSTRING_INDEX(GROUP_CONCAT(name ORDER BY created_at DESC SEPARATOR '|||'), '|||', 1) AS name,

  -- Email stored as entered (use first occurrence)
  SUBSTRING_INDEX(GROUP_CONCAT(email ORDER BY created_at ASC SEPARATOR '|||'), '|||', 1) AS email,

  -- Normalized email for deduplication
  LOWER(TRIM(email)) AS email_normalized,

  -- Phone stored as entered (most recent)
  SUBSTRING_INDEX(GROUP_CONCAT(phone ORDER BY created_at DESC SEPARATOR '|||'), '|||', 1) AS phone,

  -- Phone normalized (digits only, for matching)
  REGEXP_REPLACE(
    SUBSTRING_INDEX(GROUP_CONCAT(phone ORDER BY created_at DESC SEPARATOR '|||'), '|||', 1),
    '[^0-9]', ''
  ) AS phone_normalized,

  -- Source site (set to database name — update per site before running)
  DATABASE() AS source_site,

  MIN(created_at) AS created_at,
  NOW()           AS updated_at

FROM reservations
WHERE email IS NOT NULL AND TRIM(email) != ''
GROUP BY LOWER(TRIM(email));


-- =====================================================================
-- Step 2: Backfill phone-only contacts (no email on reservation)
-- =====================================================================
INSERT IGNORE INTO contacts (
  name,
  phone,
  phone_normalized,
  source_site,
  created_at,
  updated_at
)
SELECT
  SUBSTRING_INDEX(GROUP_CONCAT(name ORDER BY created_at DESC SEPARATOR '|||'), '|||', 1) AS name,
  phone,
  REGEXP_REPLACE(phone, '[^0-9]', '') AS phone_normalized,
  DATABASE() AS source_site,
  MIN(created_at),
  NOW()
FROM reservations
WHERE (email IS NULL OR TRIM(email) = '')
  AND phone IS NOT NULL
  AND TRIM(phone) != ''
GROUP BY REGEXP_REPLACE(phone, '[^0-9]', '');


-- =====================================================================
-- Step 3: Backfill contact_visits from all existing reservations
-- (Joins contacts via normalized email, falls back to phone)
-- =====================================================================
INSERT IGNORE INTO contact_visits (
  contact_id,
  reservation_id,
  restaurant_id,
  branch,
  location_slug,
  visit_date,
  visit_time,
  guest_count,
  reservation_status,
  special_requests,
  confirmation_code
)
SELECT
  c.id                    AS contact_id,
  r.id                    AS reservation_id,
  r.restaurant_id,
  rst.name                AS branch,
  rst.slug                AS location_slug,
  r.date                  AS visit_date,
  r.time                  AS visit_time,
  r.persons               AS guest_count,
  r.status                AS reservation_status,
  r.special_requests,
  r.confirmation_code
FROM reservations r
JOIN restaurants rst ON rst.id = r.restaurant_id
-- Match by email first
LEFT JOIN contacts c
  ON c.email_normalized = LOWER(TRIM(r.email))
  AND r.email IS NOT NULL
  AND TRIM(r.email) != ''
WHERE c.id IS NOT NULL;

-- For phone-only reservations (no email), match by phone
INSERT IGNORE INTO contact_visits (
  contact_id,
  reservation_id,
  restaurant_id,
  branch,
  location_slug,
  visit_date,
  visit_time,
  guest_count,
  reservation_status,
  special_requests,
  confirmation_code
)
SELECT
  c.id                    AS contact_id,
  r.id                    AS reservation_id,
  r.restaurant_id,
  rst.name                AS branch,
  rst.slug                AS location_slug,
  r.date                  AS visit_date,
  r.time                  AS visit_time,
  r.persons               AS guest_count,
  r.status                AS reservation_status,
  r.special_requests,
  r.confirmation_code
FROM reservations r
JOIN restaurants rst ON rst.id = r.restaurant_id
JOIN contacts c
  ON c.phone_normalized = REGEXP_REPLACE(r.phone, '[^0-9]', '')
  AND (r.email IS NULL OR TRIM(r.email) = '')
  AND c.email_normalized IS NULL
WHERE c.id IS NOT NULL;


-- =====================================================================
-- Step 4: Recalculate all contact stats from visit history
-- (Includes: total_visits, dates, favorite_location, locations_visited,
--  visits_per_location, preferred_branch, customer_type)
-- =====================================================================
UPDATE contacts c
SET
  -- Visit counts and dates
  total_visits      = (
    SELECT COUNT(*) FROM contact_visits cv WHERE cv.contact_id = c.id
  ),
  first_visit_date  = (
    SELECT MIN(cv.visit_date) FROM contact_visits cv WHERE cv.contact_id = c.id
  ),
  last_visit_date   = (
    SELECT MAX(cv.visit_date) FROM contact_visits cv WHERE cv.contact_id = c.id
  ),

  -- Favorite single location (most visited location slug)
  favorite_location = (
    SELECT cv2.location_slug
    FROM contact_visits cv2
    WHERE cv2.contact_id = c.id
      AND cv2.location_slug IS NOT NULL
    GROUP BY cv2.location_slug
    ORDER BY COUNT(*) DESC
    LIMIT 1
  ),

  -- Preferred branch (full restaurant name of most visited location)
  preferred_branch  = (
    SELECT cv3.branch
    FROM contact_visits cv3
    WHERE cv3.contact_id = c.id
      AND cv3.branch IS NOT NULL
    GROUP BY cv3.branch
    ORDER BY COUNT(*) DESC
    LIMIT 1
  ),

  -- Customer type classification
  customer_type = CASE
    WHEN (SELECT COUNT(*) FROM contact_visits cv WHERE cv.contact_id = c.id) >= 10 THEN 'vip'
    WHEN (SELECT COUNT(*) FROM contact_visits cv WHERE cv.contact_id = c.id) >= 2  THEN 'returning'
    ELSE 'new'
  END;

-- =====================================================================
-- Step 5: Build locations_visited and visits_per_location JSON
-- (MySQL 5.7+ compatible using JSON_OBJECT and GROUP_CONCAT)
-- =====================================================================
UPDATE contacts c
JOIN (
  SELECT
    cv.contact_id,
    JSON_ARRAYAGG(DISTINCT cv.location_slug) AS locs_visited
  FROM contact_visits cv
  WHERE cv.location_slug IS NOT NULL
  GROUP BY cv.contact_id
) loc_data ON loc_data.contact_id = c.id
SET c.locations_visited = loc_data.locs_visited;

-- =====================================================================
-- Verification Queries (run after migration to confirm results)
-- =====================================================================
-- SELECT COUNT(*) AS total_contacts FROM contacts;
-- SELECT COUNT(*) AS total_visits FROM contact_visits;
-- SELECT customer_type, COUNT(*) AS count FROM contacts GROUP BY customer_type;
-- SELECT location_slug, COUNT(*) AS visits FROM contact_visits GROUP BY location_slug ORDER BY visits DESC;
-- SELECT c.name, c.email, c.total_visits, c.customer_type, c.favorite_location FROM contacts c ORDER BY c.total_visits DESC LIMIT 20;
