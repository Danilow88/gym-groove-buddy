-- Create public bucket for chat images if it doesn't exist and add policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'chat-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('chat-images', 'chat-images', true);
  END IF;
END $$;

-- Policy: Public read access to chat-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Public read chat-images' 
      AND polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Public read chat-images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'chat-images');
  END IF;
END $$;

-- Policy: Users can upload to their own folder (userId/filename)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users upload to own folder chat-images' 
      AND polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Users upload to own folder chat-images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'chat-images'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Policy: Users can update their own files in chat-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users update own files chat-images' 
      AND polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Users update own files chat-images"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'chat-images'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Policy: Users can delete their own files in chat-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users delete own files chat-images' 
      AND polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Users delete own files chat-images"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'chat-images'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;