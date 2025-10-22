-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DNI', 'RUC', 'CE', 'PASSPORT');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SELLER', 'WAREHOUSE', 'MANAGER');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('RECEIPT', 'INVOICE', 'SALE_NOTE', 'PROFORMA');

-- CreateEnum
CREATE TYPE "SunatStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "SunatEnvironment" AS ENUM ('PRODUCTION', 'TEST');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('UNIT', 'KILOGRAM', 'LITER', 'METER', 'BOX', 'PACK', 'DOZEN');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'REGISTERED', 'CANCELLED', 'RECEIVED');

-- CreateEnum
CREATE TYPE "PurchaseDocumentType" AS ENUM ('INVOICE', 'RECEIPT', 'NOTE', 'ORDER');

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "document_number" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "legal_name" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "store_id" TEXT,
    "person_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "category_id" TEXT,
    "brand_id" TEXT,
    "sku_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "purchase_price" DOUBLE PRECISION NOT NULL,
    "sale_price" DOUBLE PRECISION NOT NULL,
    "current_stock" INTEGER NOT NULL DEFAULT 0,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "minimum_stock" INTEGER NOT NULL DEFAULT 5,
    "maximum_stock" INTEGER,
    "unit_of_measure" "UnitOfMeasure" NOT NULL DEFAULT 'UNIT',
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "document_number" TEXT,
    "document_type" "PurchaseDocumentType" NOT NULL DEFAULT 'INVOICE',
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'REGISTERED',
    "notes" TEXT,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_details" (
    "id" TEXT NOT NULL,
    "purchase_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_details_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "persons_document_number_key" ON "persons"("document_number");

-- CreateIndex
CREATE INDEX "persons_document_number_idx" ON "persons"("document_number");

-- CreateIndex
CREATE INDEX "persons_status_idx" ON "persons"("status");

-- CreateIndex
CREATE UNIQUE INDEX "stores_ruc_key" ON "stores"("ruc");

-- CreateIndex
CREATE INDEX "stores_status_idx" ON "stores"("status");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE INDEX "suppliers_status_idx" ON "suppliers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_store_id_idx" ON "users"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_series_store_id_voucher_type_series_key" ON "voucher_series"("store_id", "voucher_type", "series");

-- CreateIndex
CREATE INDEX "brands_status_idx" ON "brands"("status");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_code_key" ON "products"("sku_code");

-- CreateIndex
CREATE INDEX "products_sku_code_idx" ON "products"("sku_code");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE INDEX "products_store_id_idx" ON "products"("store_id");

-- CreateIndex
CREATE INDEX "purchases_status_idx" ON "purchases"("status");

-- CreateIndex
CREATE INDEX "purchases_purchase_date_idx" ON "purchases"("purchase_date");

-- CreateIndex
CREATE UNIQUE INDEX "sunat_config_store_id_key" ON "sunat_config"("store_id");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_series" ADD CONSTRAINT "voucher_series_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_details" ADD CONSTRAINT "purchase_details_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_details" ADD CONSTRAINT "purchase_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sunat_config" ADD CONSTRAINT "sunat_config_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
