-- ====================================================================
-- BABU CINEMAS - SUPABASE DATABASE SCHEMA
-- Compatible with PostgreSQL & Supabase SQL Editor
-- ====================================================================

-- 1. Create tables if they do not exist

-- Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    genre JSONB DEFAULT '[]'::jsonb,
    language TEXT DEFAULT 'Tamil',
    duration TEXT,
    rating TEXT,
    imdb_score NUMERIC(3, 1),
    release_date TEXT,
    director TEXT,
    cast_members JSONB DEFAULT '[]'::jsonb,
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    status TEXT DEFAULT 'now-showing',
    available_formats JSONB DEFAULT '["2D", "4K Dolby Atmos"]'::jsonb,
    screens JSONB DEFAULT '["Screen 1 - 4K Dolby Atmos"]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Showtimes Table
CREATE TABLE IF NOT EXISTS showtimes (
    id TEXT PRIMARY KEY,
    movie_id TEXT REFERENCES movies(id) ON DELETE CASCADE,
    screen_name TEXT NOT NULL,
    time TEXT NOT NULL,
    period TEXT,
    format TEXT DEFAULT '4K Dolby Atmos',
    date TEXT NOT NULL,
    occupied_seat_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Pricing Configuration
CREATE TABLE IF NOT EXISTS pricing (
    id TEXT PRIMARY KEY DEFAULT 'default',
    vip INTEGER NOT NULL DEFAULT 250,
    premium INTEGER NOT NULL DEFAULT 200,
    regular INTEGER NOT NULL DEFAULT 150,
    convenience_fee INTEGER NOT NULL DEFAULT 30,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers & Promo Coupons Table
CREATE TABLE IF NOT EXISTS offers (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT DEFAULT 'percentage',
    discount_value NUMERIC NOT NULL,
    min_tickets INTEGER DEFAULT 1,
    valid_until TEXT,
    category TEXT,
    icon TEXT,
    terms JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    movie_id TEXT NOT NULL,
    movie_title TEXT NOT NULL,
    movie_poster TEXT,
    movie_format TEXT,
    theatre_name TEXT DEFAULT 'BABU CINEMAS',
    screen_name TEXT,
    date TEXT NOT NULL,
    showtime TEXT NOT NULL,
    seats JSONB NOT NULL,
    ticket_total NUMERIC NOT NULL,
    convenience_fee NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    discount_code TEXT,
    total_paid NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_id TEXT,
    order_id TEXT,
    status TEXT DEFAULT 'CONFIRMED',
    booked_at TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Audit / Gateway Log Table
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    method TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) & Add Public Policies for Web App
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog data
CREATE POLICY "Public can view movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Public can view showtimes" ON showtimes FOR SELECT USING (true);
CREATE POLICY "Public can view pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Public can view offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public can view bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Public can insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view payments" ON payments FOR SELECT USING (true);

-- Admin / Backend write access (Service role bypasses RLS automatically)
CREATE POLICY "Service role full access movies" ON movies FOR ALL USING (true);
CREATE POLICY "Service role full access showtimes" ON showtimes FOR ALL USING (true);
CREATE POLICY "Service role full access pricing" ON pricing FOR ALL USING (true);
CREATE POLICY "Service role full access offers" ON offers FOR ALL USING (true);

-- 3. Seed Default Pricing
INSERT INTO pricing (id, vip, premium, regular, convenience_fee)
VALUES ('default', 250, 200, 150, 30)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Default Promo Offers
INSERT INTO offers (id, code, title, description, discount_type, discount_value, min_tickets, valid_until, category, icon, terms)
VALUES
('offer-1', 'BABU50', 'Flat 50% Off on 2+ Tickets', 'Get 50% instant discount on bookings of 2 or more tickets across any screen.', 'percentage', 50, 2, '2026-12-31', 'Weekend', 'Sparkles', '["Valid on minimum 2 tickets", "Maximum discount ₹200", "Valid once per user"]'::jsonb),
('offer-2', 'STUDENT25', 'Student Rush Hour Deal', 'Special 25% discount for college & school students for weekday afternoon shows.', 'percentage', 25, 1, '2026-11-30', 'Student', 'GraduationCap', '["Valid on student ID verification at counter", "Applicable on Weekdays only"]'::jsonb),
('offer-3', 'FAMILYFLAT', 'Family Cinema Bonanza', 'Save flat ₹150 when you book 4 or more tickets for family screenings.', 'fixed', 150, 4, '2026-12-31', 'Family', 'Users', '["Minimum 4 tickets required", "Valid for all shows"]'::jsonb),
('offer-4', 'POPCORN100', 'Snack & Movie Combo Save', 'Flat ₹100 instant waiver on premium Dolby Atmos screen tickets.', 'fixed', 100, 2, '2026-10-31', 'Food', 'Popcorn', '["Valid on Screen 1 Dolby Atmos only", "Minimum 2 tickets"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
