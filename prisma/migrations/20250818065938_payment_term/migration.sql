-- CreateEnum
CREATE TYPE "public"."PaymentTerm" AS ENUM ('NET1', 'NET7', 'NET14', 'NET30');

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paymentTerm" "public"."PaymentTerm" NOT NULL DEFAULT 'NET30';
