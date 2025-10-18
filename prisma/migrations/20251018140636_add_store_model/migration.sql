-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo_url" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_ruc_key" ON "stores"("ruc");

-- CreateIndex
CREATE INDEX "stores_status_idx" ON "stores"("status");
