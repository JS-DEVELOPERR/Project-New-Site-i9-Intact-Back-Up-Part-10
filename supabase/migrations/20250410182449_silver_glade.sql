/*
  # Update Section 1 Schema
  
  1. Changes
    - Add IMG column to section_1 table
    - Update existing data
    - Remove unused columns
*/

-- Add new IMG column
ALTER TABLE section_1 ADD COLUMN img_type TEXT CHECK (img_type IN ('video', 'image'));
ALTER TABLE section_1 ADD COLUMN img_url TEXT;

-- Update existing data
UPDATE section_1 
SET 
  img_type = 'video',
  img_url = video_url
WHERE video_url IS NOT NULL;

-- Drop unused columns
ALTER TABLE section_1 DROP COLUMN video_url;
ALTER TABLE section_1 DROP COLUMN background_image_url;