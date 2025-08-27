-- Fix RLS policies for sites and categories tables
-- This migration addresses INSERT permission issues

-- Sites table: Add missing INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert sites" ON sites 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Sites table: Add UPDATE and DELETE policies for authenticated users
CREATE POLICY "Authenticated users can update sites" ON sites 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete sites" ON sites 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Categories table: Add missing INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert categories" ON categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Categories table: Add UPDATE and DELETE policies for authenticated users
CREATE POLICY "Authenticated users can update categories" ON categories 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories" ON categories 
FOR DELETE 
USING (auth.uid() IS NOT NULL);