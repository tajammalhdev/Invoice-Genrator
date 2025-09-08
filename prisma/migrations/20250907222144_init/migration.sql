/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyPhone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateFormat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `invoicePrefix` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nextInvoiceNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "city",
DROP COLUMN "companyEmail",
DROP COLUMN "companyName",
DROP COLUMN "companyPhone",
DROP COLUMN "country",
DROP COLUMN "currency",
DROP COLUMN "dateFormat",
DROP COLUMN "invoicePrefix",
DROP COLUMN "logoUrl",
DROP COLUMN "nextInvoiceNumber",
DROP COLUMN "state",
DROP COLUMN "taxRate",
DROP COLUMN "zip";

-- CreateTable
CREATE TABLE "public"."Setting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "dateFormat" TEXT NOT NULL DEFAULT 'yyyy-MM-dd',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV-',
    "nextInvoiceNumber" INTEGER NOT NULL DEFAULT 1,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_userId_key" ON "public"."Setting"("userId");

-- AddForeignKey
ALTER TABLE "public"."Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
