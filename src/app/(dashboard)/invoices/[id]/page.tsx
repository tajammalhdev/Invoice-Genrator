"use client";

import { useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import {
	useInvoiceContext,
	useInvoiceActions,
} from "@/hooks/invoice/InvoiceContext";
import InvoiceForm from "../../components/_invoices/InvoiceForm";

interface InvoicePageProps {
	params: { id: string };
}
export default function InvoicePage({ params }: InvoicePageProps) {
	const { id } = useParams();

	const { loading, getInvoiceById } = useInvoiceContext();
	const { isEditing, setInvoiceToEdit } = useInvoiceActions();

	const invoiceId = id as string;
	const invoice = getInvoiceById(invoiceId);

	// Set up editing state when component mounts
	useEffect(() => {
		if (invoice && !isEditing) {
			setInvoiceToEdit(invoice);
		}
	}, [invoice, isEditing, setInvoiceToEdit]);

	// Handle loading state
	if (loading.invoices) {
		return null; // or a simple loading indicator
	}

	// Example of editing functionality
	const handleSaveInvoice = () => {
		// Save logic here
	};

	const handleCancelEdit = () => {};

	return <InvoiceForm />;
}
