-- Chat messages table and RLS
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Participants can read their messages
DROP POLICY IF EXISTS "Participants can view their messages" ON public.chat_messages;
CREATE POLICY "Participants can view their messages"
ON public.chat_messages
FOR SELECT
USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);

-- Only the sender can insert
DROP POLICY IF EXISTS "Sender can insert messages" ON public.chat_messages;
CREATE POLICY "Sender can insert messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
);

-- Optional: sender can delete own messages
DROP POLICY IF EXISTS "Sender can delete own messages" ON public.chat_messages;
CREATE POLICY "Sender can delete own messages"
ON public.chat_messages
FOR DELETE
USING (
  sender_id = auth.uid()
);

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;


