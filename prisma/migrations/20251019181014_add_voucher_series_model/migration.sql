-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('RECEIPT', 'INVOICE', 'SALE_NOTE', 'PROFORMA');

-- CreateTable
CREATE TABLE "voucher_series" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "voucher_type" "VoucherType" NOT NULL,
    "series" TEXT NOT NULL,
    "current_number" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voucher_series_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voucher_series_store_id_voucher_type_series_key" ON "voucher_series"("store_id", "voucher_type", "series");

-- AddForeignKey
ALTER TABLE "voucher_series" ADD CONSTRAINT "voucher_series_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
