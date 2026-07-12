-- SQL Script to set up tables in Supabase SQL Editor
-- Project ID: knjpeszrhkrprsjafqsq

-- 1. Drop existing tables if they exist
DROP TABLE IF EXISTS payouts;
DROP TABLE IF EXISTS members;

-- 2. Create members table
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  "promoCode" TEXT UNIQUE NOT NULL,
  "joinedAt" TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Aktif', 'Pending')),
  "referredBy" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  password TEXT
);

-- 3. Create payouts table
CREATE TABLE payouts (
  id TEXT PRIMARY KEY,
  "memberName" TEXT NOT NULL,
  "refCode" TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  "walletType" TEXT NOT NULL,
  "walletNumber" TEXT NOT NULL,
  "walletOwner" TEXT NOT NULL,
  "requestedAt" TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Menunggu', 'Selesai', 'Ditolak')),
  "referredMemberId" TEXT REFERENCES members(id) ON DELETE SET NULL
);

-- 4. Disable Row Level Security (RLS) to allow public access from our client-side app
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE payouts DISABLE ROW LEVEL SECURITY;

-- 5. Seed initial mock members (Data Dummy)
INSERT INTO members (id, phone, "promoCode", "joinedAt", status, "referredBy", role, username, password) VALUES
('m-1', '082371068831', 'RIZQO_INS', '01 Juli 2026', 'Aktif', '-', 'admin', 'admin', 'admin123'),
('m-2', '081234567890', 'ANDI_INS', '05 Juli 2026', 'Aktif', 'RIZQO_INS', 'member', 'andi', 'andi123'),
('m-3', '082233445566', 'SARAH_OK', '03 Juli 2026', 'Aktif', 'RIZQO_INS', 'member', 'sarah', 'sarah123'),
('m-4', '089988776655', 'BUDI_99', '28 Juni 2026', 'Aktif', 'RIZQO_INS', 'member', 'budi', 'budi123'),
('m-5', '085566778899', 'FARHAN_7', '25 Juni 2026', 'Pending', 'RIZQO_INS', 'member', 'farhan', 'farhan123')
ON CONFLICT (id) DO NOTHING;

-- 6. Seed initial mock payouts (Data Dummy)
INSERT INTO payouts (id, "memberName", "refCode", amount, "walletType", "walletNumber", "walletOwner", "requestedAt", status, "referredMemberId") VALUES
('p-1', 'admin', 'RIZQO_INS', 150000, 'Dana', '082371068831', 'Rizqo Fadhilah', '05 Juli 2026', 'Selesai', 'm-2'),
('p-2', 'admin', 'RIZQO_INS', 50000, 'Dana', '082371068831', 'Rizqo Fadhilah', '06 Juli 2026', 'Menunggu', 'm-5'),
('p-3', 'andi', 'ANDI_INS', 100000, 'BCA', '123456789', 'Andi Saputra', '04 Juli 2026', 'Selesai', 'm-3')
ON CONFLICT (id) DO NOTHING;

-- 7. Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_draft BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  title TEXT NOT NULL,
  description TEXT,
  prompt_template TEXT,
  variables JSONB NOT NULL DEFAULT '{}',
  materi_tutorial JSONB NOT NULL DEFAULT '{}',
  duration TEXT,
  youtube_url TEXT,
  gemini_tool_url TEXT,
  roadmap JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) to allow public access from our client-side app
ALTER TABLE workflows DISABLE ROW LEVEL SECURITY;
