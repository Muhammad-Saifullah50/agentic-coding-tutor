-- Add columns to UserProfile table for Gamification (Streak & XP)

ALTER TABLE "UserProfile" 
ADD COLUMN IF NOT EXISTS "xp" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "streak" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "last_activity_date" DATE;
