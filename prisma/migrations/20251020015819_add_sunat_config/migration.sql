-- CreateEnum
CREATE TYPE "SunatStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "SunatEnvironment" AS ENUM ('PRODUCTION', 'TEST');

-- CreateTable
CREATE TABLE "sunat_config" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "sol_username" TEXT NOT NULL,
    "sol_password" TEXT NOT NULL,
    "digital_certificate" BYTEA,
    "certificate_password" TEXT,
    "sunat_api_url" TEXT,
    "environment" "SunatEnvironment" NOT NULL DEFAULT 'TEST',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sunat_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sunat_config_store_id_key" ON "sunat_config"("store_id");

-- AddForeignKey
ALTER TABLE "sunat_config" ADD CONSTRAINT "sunat_config_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
