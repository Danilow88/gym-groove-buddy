-- Create storage bucket for chat images
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-images', 'chat-images', true);

-- Storage policies for chat images
CREATE POLICY "Users can upload their own chat images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view chat images they have access to" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chat-images');

CREATE POLICY "Users can update their own chat images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chat images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image support to chat messages
ALTER TABLE public.chat_messages ADD COLUMN image_url text;

-- Add weight and height to profiles
ALTER TABLE public.profiles ADD COLUMN weight numeric;
ALTER TABLE public.profiles ADD COLUMN height numeric;
ALTER TABLE public.profiles ADD COLUMN birth_date date;