-- Quick fix for RLS policies - Run this in Supabase Studio SQL Editor

-- Sites table: Add missing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert sites" ON sites;
CREATE POLICY "Authenticated users can insert sites" ON sites 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Sites table: Add UPDATE policy  
DROP POLICY IF EXISTS "Authenticated users can update sites" ON sites;
CREATE POLICY "Authenticated users can update sites" ON sites 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Sites table: Add DELETE policy
DROP POLICY IF EXISTS "Authenticated users can delete sites" ON sites;
CREATE POLICY "Authenticated users can delete sites" ON sites 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Categories table: Add missing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
CREATE POLICY "Authenticated users can insert categories" ON categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Categories table: Add UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
CREATE POLICY "Authenticated users can update categories" ON categories 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Categories table: Add DELETE policy
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
CREATE POLICY "Authenticated users can delete categories" ON categories 
FOR DELETE 
USING (auth.uid() IS NOT NULL);