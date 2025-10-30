-- Create water quality readings table
CREATE TABLE public.water_quality_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ph DECIMAL(4,2) NOT NULL CHECK (ph >= 0 AND ph <= 14),
  temperature DECIMAL(5,2) NOT NULL,
  turbidity DECIMAL(6,2) NOT NULL CHECK (turbidity >= 0),
  conductivity DECIMAL(8,2) NOT NULL CHECK (conductivity >= 0),
  quality_status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create water usage records table
CREATE TABLE public.water_usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usage_liters DECIMAL(10,2) NOT NULL CHECK (usage_liters >= 0),
  activity_type TEXT NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create educational content table
CREATE TABLE public.educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.water_quality_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

-- Public access policies (no authentication required for this educational app)
CREATE POLICY "Anyone can view water quality readings"
  ON public.water_quality_readings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert water quality readings"
  ON public.water_quality_readings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view water usage records"
  ON public.water_usage_records FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert water usage records"
  ON public.water_usage_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view educational content"
  ON public.educational_content FOR SELECT
  USING (true);

-- Insert initial educational content
INSERT INTO public.educational_content (title, category, content) VALUES
('Boiling Water', 'Treatment Method', 'Boil water for at least 1 minute to kill bacteria, viruses, and parasites. This is the most effective method when resources are limited. Let it cool before drinking.'),
('Ceramic Water Filters', 'Treatment Method', 'Ceramic filters remove bacteria and sediment. They are affordable and can last for years with proper maintenance. Clean the filter regularly to maintain effectiveness.'),
('Chlorine Treatment', 'Treatment Method', 'Add 2 drops of household bleach (5-6% chlorine) per liter of water. Mix well and let it stand for 30 minutes before use. Effective against most microorganisms.'),
('Solar Disinfection (SODIS)', 'Treatment Method', 'Fill clear plastic bottles with water and expose to direct sunlight for 6 hours. UV radiation kills pathogens. This method is free and effective in sunny climates.'),
('Sand Filtration', 'Treatment Method', 'Layer sand, gravel, and charcoal in a container. Pour water through to remove particles and some pathogens. Combine with other methods for best results.'),
('SDG 6: Clean Water and Sanitation', 'SDG Information', 'SDG 6 aims to ensure availability and sustainable management of water and sanitation for all by 2030. This includes safe drinking water, sanitation facilities, and protecting water ecosystems.'),
('Water Quality Parameters', 'Education', 'Key parameters include pH (6.5-8.5 ideal), temperature (affects bacterial growth), turbidity (cloudiness), and conductivity (dissolved minerals). Regular testing ensures safe water.'),
('Rainwater Harvesting', 'Conservation', 'Collect and store rainwater from roofs. Use for non-drinking purposes or treat before drinking. This reduces pressure on groundwater and saves money on water bills.');