-- Migration number: 0009 	 2023-01-08T19:23:15.969Z
ALTER TABLE users
ADD COLUMN display_name TEXT
ADD COLUMN bio TEXT;