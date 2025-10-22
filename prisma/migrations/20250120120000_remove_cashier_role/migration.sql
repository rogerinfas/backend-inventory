-- Remove CASHIER from UserRole enum
-- First, update any existing users with CASHIER role to SELLER
UPDATE "users" SET "role" = 'SELLER' WHERE "role" = 'CASHIER';

-- Create new enum without CASHIER
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'SELLER', 'WAREHOUSE', 'MANAGER');

-- Update the column to use the new enum
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING "role"::text::"UserRole_new";

-- Drop the old enum and rename the new one
DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
