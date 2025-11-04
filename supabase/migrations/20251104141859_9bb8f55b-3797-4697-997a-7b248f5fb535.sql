-- Create water_reports table for tracking water issues
CREATE TABLE IF NOT EXISTS public.water_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  report_type TEXT NOT NULL CHECK (report_type IN ('leak', 'contamination', 'dry_source', 'poor_quality', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.water_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can view and create reports)
CREATE POLICY "Anyone can view water reports" 
ON public.water_reports 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create water reports" 
ON public.water_reports 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_water_reports_status ON public.water_reports(status);
CREATE INDEX idx_water_reports_created_at ON public.water_reports(created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_water_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_water_reports_updated_at
BEFORE UPDATE ON public.water_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_water_reports_updated_at();