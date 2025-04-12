/*
  # Add Testimonials Table

  1. New Tables
    - `depoimentos_i9` (testimonials)
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `position` (text, required)
      - `image` (text, required)
      - `content` (text, required)
      - `rating` (numeric, required)
      - `full_testimonial` (text, required)
      - `active` (boolean, default true)
      - `order_index` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `depoimentos_i9` table
    - Add policies for public read access
    - Add policies for authenticated users to manage testimonials
*/

CREATE TABLE IF NOT EXISTS depoimentos_i9 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  position text NOT NULL,
  image text NOT NULL,
  content text NOT NULL,
  rating numeric(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  full_testimonial text NOT NULL,
  active boolean DEFAULT true,
  order_index integer
);

-- Enable Row Level Security
ALTER TABLE depoimentos_i9 ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active testimonials
CREATE POLICY "Enable public read access to active testimonials"
  ON depoimentos_i9
  FOR SELECT
  TO public
  USING (active = true);

-- Allow authenticated users to manage testimonials
CREATE POLICY "Enable authenticated users to manage testimonials"
  ON depoimentos_i9
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_depoimentos_i9_active ON depoimentos_i9(active);
CREATE INDEX idx_depoimentos_i9_order_index ON depoimentos_i9(order_index);