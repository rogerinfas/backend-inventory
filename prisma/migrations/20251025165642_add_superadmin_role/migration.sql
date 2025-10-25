/*
  Warnings:

  - The values [WAREHOUSE,MANAGER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `legal_name` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `legal_name` on the `stores` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPERADMIN', 'ADMIN', 'SELLER');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "legal_name";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "email",
DROP COLUMN "legal_name";
