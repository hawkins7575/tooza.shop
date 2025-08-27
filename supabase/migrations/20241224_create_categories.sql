-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories (admin only)
CREATE POLICY "Anyone can view categories" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert categories" 
ON categories FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update categories" 
ON categories FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete categories" 
ON categories FOR DELETE 
USING (auth.jwt() ->> 'role' = 'admin');

-- Index for performance
CREATE INDEX idx_categories_name ON categories(name);

-- Insert existing categories from sites table
INSERT INTO categories (name, icon, description) VALUES
  ('주식', '📈', '주식 투자 관련 사이트'),
  ('부동산', '🏠', '부동산 투자 관련 사이트'),
  ('코인', '₿', '암호화폐 투자 관련 사이트'),
  ('펀드', '💼', '펀드 투자 관련 사이트'),
  ('채권', '📋', '채권 투자 관련 사이트'),
  ('원자재', '🥇', '원자재 투자 관련 사이트'),
  ('뉴스', '📰', '투자 뉴스 및 정보 사이트'),
  ('교육', '📚', '투자 교육 관련 사이트')
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_categories_updated_at 
BEFORE UPDATE ON categories 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();