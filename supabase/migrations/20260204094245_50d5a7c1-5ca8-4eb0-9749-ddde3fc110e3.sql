-- Create enum for event mode
CREATE TYPE public.event_mode AS ENUM ('in-person', 'hybrid');

-- Create enum for event type
CREATE TYPE public.event_type AS ENUM ('Simple', 'Standard', 'Advance');

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  website_url TEXT,
  mode event_mode NOT NULL DEFAULT 'in-person',
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  timezone TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  type event_type NOT NULL DEFAULT 'Standard',
  session_required BOOLEAN NOT NULL DEFAULT false,
  comms_required BOOLEAN NOT NULL DEFAULT false,
  survey_required BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enum for user type
CREATE TYPE public.event_user_type AS ENUM ('attendee', 'delegate', 'crew', 'organizer');

-- Create event_users table
CREATE TABLE public.event_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_type event_user_type NOT NULL,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, email, user_type)
);

-- Create sessions table
CREATE TABLE public.event_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sessions ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for now, will add auth later)
CREATE POLICY "Events are publicly readable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Events are publicly insertable" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Events are publicly updatable" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Events are publicly deletable" ON public.events FOR DELETE USING (true);

CREATE POLICY "Event users are publicly readable" ON public.event_users FOR SELECT USING (true);
CREATE POLICY "Event users are publicly insertable" ON public.event_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Event users are publicly updatable" ON public.event_users FOR UPDATE USING (true);
CREATE POLICY "Event users are publicly deletable" ON public.event_users FOR DELETE USING (true);

CREATE POLICY "Event sessions are publicly readable" ON public.event_sessions FOR SELECT USING (true);
CREATE POLICY "Event sessions are publicly insertable" ON public.event_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Event sessions are publicly updatable" ON public.event_sessions FOR UPDATE USING (true);
CREATE POLICY "Event sessions are publicly deletable" ON public.event_sessions FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_users_updated_at BEFORE UPDATE ON public.event_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_sessions_updated_at BEFORE UPDATE ON public.event_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();