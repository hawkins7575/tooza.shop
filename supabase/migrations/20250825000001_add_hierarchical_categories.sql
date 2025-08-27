-- Add hierarchical category support
-- Add parent_id column to support parent-child relationships
-- Add ordering field for category position management

-- Add parent_id column to categories table
ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Add sort_order column for positioning
ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Add constraint to prevent self-referencing and circular references
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

-- Create trigger to prevent circular references
CREATE TRIGGER prevent_category_circular_reference_trigger
BEFORE INSERT OR UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION prevent_category_circular_reference();

-- Update existing categories with sort_order
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
  END;