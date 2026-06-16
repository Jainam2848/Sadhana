-- Set up Supabase Storage media bucket and security policies

-- 1. Insert bucket definition
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'media', 
    'media', 
    true, 
    104857600, -- 100MB limit
    ARRAY['audio/mpeg', 'audio/mp3', 'video/mp4', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Define Object Access Policies
CREATE POLICY "Allow public download access for media files" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'media');

CREATE POLICY "Allow file uploads only for admin service role" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'media' AND auth.role() = 'service_role');

CREATE POLICY "Allow file deletions only for admin service role" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'media' AND auth.role() = 'service_role');

-- 3. Define Bucket Access Policies
CREATE POLICY "Allow public read access for buckets" 
    ON storage.buckets FOR SELECT 
    USING (public = true);

