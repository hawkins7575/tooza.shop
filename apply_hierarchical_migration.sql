-- Manual application of hierarchical categories migration
-- Check if columns exist before adding them

-- Add parent_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'parent_id') THEN
        ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- Add sort_order column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'sort_order') THEN
        ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Create or replace circular reference prevention function
CREATE OR REPLACE FUNCTION prevent_category_circular_reference()
RETURNS TRIGGER AS $$
DECLARE
    temp_id UUID;
BEGIN
    -- Prevent self-reference
    IF NEW.parent_id = NEW.id THEN
        RAISE EXCEPTION 'Category cannot be its own parent';
    END IF;
    
    -- Check for circular reference
    temp_id := NEW.parent_id;
    WHILE temp_id IS NOT NULL LOOP
        SELECT parent_id INTO temp_id FROM categories WHERE id = temp_id;
        IF temp_id = NEW.id THEN
            RAISE EXCEPTION 'Circular reference detected in category hierarchy';
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS prevent_category_circular_reference_trigger ON categories;
CREATE TRIGGER prevent_category_circular_reference_trigger
BEFORE INSERT OR UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION prevent_category_circular_reference();

-- Update existing categories with sort_order only if sort_order is 0
UPDATE categories SET sort_order = 
  CASE name
    WHEN '주식' THEN 1
    WHEN '부동산' THEN 2
    WHEN '코인' THEN 3
    WHEN '펀드' THEN 4
    WHEN '채권' THEN 5
    WHEN '원자재' THEN 6
    WHEN '뉴스' THEN 7
    WHEN '교육' THEN 8
    ELSE 999
  END
WHERE sort_order = 0;