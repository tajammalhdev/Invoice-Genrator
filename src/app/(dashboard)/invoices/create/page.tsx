"use client";

import { useEffect } from "react";
import InvoiceForm from "../../components/_invoices/InvoiceForm";
import { useInvoiceActions } from "@/hooks/invoice/InvoiceContext";

export default function CreateInvoice() {
	return <InvoiceForm type="create" />;
}
