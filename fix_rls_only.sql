-- Add missing RLS policies for sites and categories tables

-- Sites table: Add missing INSERT policy
DO $$ 
BEGIN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "Authenticated users can insert sites" ON sites;
    
    -- Create new policy for INSERT
    CREATE POLICY "Authenticated users can insert sites" ON sites 
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN others THEN
        -- Create new policy if table exists
        CREATE POLICY "Authenticated users can insert sites" ON sites 
        FOR INSERT 
        WITH CHECK (auth.uid() IS NOT NULL);
END $$;

-- Sites table: Add UPDATE policy  
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can update sites" ON sites;
    CREATE POLICY "Authenticated users can update sites" ON sites 
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN others THEN
        CREATE POLICY "Authenticated users can update sites" ON sites 
        FOR UPDATE 
        USING (auth.uid() IS NOT NULL);
END $$;

-- Sites table: Add DELETE policy
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can delete sites" ON sites;
    CREATE POLICY "Authenticated users can delete sites" ON sites 
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN others THEN
        CREATE POLICY "Authenticated users can delete sites" ON sites 
        FOR DELETE 
        USING (auth.uid() IS NOT NULL);
END $$;

-- Categories table: Add missing INSERT policy
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
    CREATE POLICY "Authenticated users can insert categories" ON categories 
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN others THEN
        CREATE POLICY "Authenticated users can insert categories" ON categories 
        FOR INSERT 
        WITH CHECK (auth.uid() IS NOT NULL);
END $$;

-- Categories table: Add UPDATE policy
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
    CREATE POLICY "Authenticated users can update categories" ON categories 
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN others THEN
        CREATE POLICY "Authenticated users can update categories" ON categories 
        FOR UPDATE 
        USING (auth.uid() IS NOT NULL);
END $$;

-- Categories table: Add DELETE policy
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
    CREATE POLICY "Authenticated users can delete categories" ON categories 
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN others THEN
        CREATE POLICY "Authenticated users can delete categories" ON categories 
        FOR DELETE 
        USING (auth.uid() IS NOT NULL);
END $$;