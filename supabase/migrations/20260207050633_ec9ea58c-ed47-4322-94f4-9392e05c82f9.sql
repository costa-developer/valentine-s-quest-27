-- Create enum for answer types
CREATE TYPE public.answer_type AS ENUM ('yes', 'maybe');

-- Create table to store valentine responses
CREATE TABLE public.valentine_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id INTEGER NOT NULL,
    answer answer_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valentine_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert responses (girlfriend doesn't need to be logged in)
CREATE POLICY "Anyone can insert responses"
ON public.valentine_responses
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can view responses
CREATE POLICY "Admins can view all responses"
ON public.valentine_responses
FOR SELECT
TO authenticated
USING (true);

-- Create table to track acceptance status
CREATE TABLE public.valentine_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accepted BOOLEAN NOT NULL DEFAULT false,
    accepted_at TIMESTAMP WITH TIME ZONE,
    love_meter_value INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valentine_status ENABLE ROW LEVEL SECURITY;

-- Allow anyone to update status (girlfriend doesn't need to be logged in)
CREATE POLICY "Anyone can insert status"
ON public.valentine_status
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update status"
ON public.valentine_status
FOR UPDATE
USING (true);

-- Only authenticated users can view status
CREATE POLICY "Admins can view status"
ON public.valentine_status
FOR SELECT
TO authenticated
USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.valentine_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.valentine_status;