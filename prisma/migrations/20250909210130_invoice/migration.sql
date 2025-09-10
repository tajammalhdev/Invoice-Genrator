-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "discountType" "public"."DiscountType" NOT NULL DEFAULT 'PERCENTAGE';
