
-- Table for temporary email sessions
CREATE TABLE public.temp_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes')
);

-- Table for incoming emails
CREATE TABLE public.incoming_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.temp_sessions(id) ON DELETE CASCADE,
  from_address TEXT NOT NULL,
  from_name TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '(no subject)',
  body TEXT NOT NULL DEFAULT '',
  has_attachment BOOLEAN NOT NULL DEFAULT false,
  is_read BOOLEAN NOT NULL DEFAULT false,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.temp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incoming_emails ENABLE ROW LEVEL SECURITY;

-- Public read access (anonymous users, no auth required)
CREATE POLICY "Anyone can read sessions" ON public.temp_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sessions" ON public.temp_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their sessions" ON public.temp_sessions FOR DELETE USING (true);

CREATE POLICY "Anyone can read emails" ON public.incoming_emails FOR SELECT USING (true);
CREATE POLICY "Anyone can insert emails" ON public.incoming_emails FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update emails" ON public.incoming_emails FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete emails" ON public.incoming_emails FOR DELETE USING (true);

-- Index for faster lookups
CREATE INDEX idx_incoming_emails_session ON public.incoming_emails(session_id);
CREATE INDEX idx_temp_sessions_email ON public.temp_sessions(email_address);
CREATE INDEX idx_temp_sessions_expires ON public.temp_sessions(expires_at);

-- Enable realtime for incoming emails
ALTER PUBLICATION supabase_realtime ADD TABLE public.incoming_emails;
