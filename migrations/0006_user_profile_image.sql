-- Migration number: 0006 	 2023-01-07T11:52:23.295Z
ALTER TABLE users
ADD COLUMN profile_image_url TEXT
ADD COLUMN header_image_url TEXT;