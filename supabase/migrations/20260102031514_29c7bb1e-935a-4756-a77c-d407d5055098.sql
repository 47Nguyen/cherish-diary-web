-- Create moods table for tracking daily mood entries
CREATE TABLE public.moods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  emoji TEXT NOT NULL,
  mood_label TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist table for tracking wishes/wants
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  is_fulfilled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access since no login required)
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read moods
CREATE POLICY "Anyone can view moods" 
ON public.moods 
FOR SELECT 
USING (true);

-- Allow anyone to insert moods
CREATE POLICY "Anyone can insert moods" 
ON public.moods 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view wishlist
CREATE POLICY "Anyone can view wishlist" 
ON public.wishlist 
FOR SELECT 
USING (true);

-- Allow anyone to insert wishlist items
CREATE POLICY "Anyone can insert wishlist items" 
ON public.wishlist 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update wishlist items (for marking as fulfilled)
CREATE POLICY "Anyone can update wishlist items" 
ON public.wishlist 
FOR UPDATE 
USING (true);

-- Allow anyone to delete wishlist items
CREATE POLICY "Anyone can delete wishlist items" 
ON public.wishlist 
FOR DELETE 
USING (true);