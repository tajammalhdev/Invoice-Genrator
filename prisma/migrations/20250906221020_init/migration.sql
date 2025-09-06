-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("number") ON DELETE CASCADE ON UPDATE CASCADE;
