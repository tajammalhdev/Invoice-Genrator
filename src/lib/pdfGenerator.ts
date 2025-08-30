import { jsPDF } from "jspdf";
import { Invoice, Client, Setting, InvoiceItem } from "@prisma/client";

interface InvoiceWithRelations extends Invoice {
	client: Client;
	items: InvoiceItem[];
}

export const generateInvoicePDF = (
	invoice: InvoiceWithRelations,
	companySettings: Setting | null,
) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.width;
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;

	// Helper function to draw borders
	const drawBorder = (x: number, y: number, width: number, height: number) => {
		doc.setDrawColor(200, 200, 200);
		doc.setLineWidth(0.5);
		doc.rect(x, y, width, height);
	};

	// Company header section with border
	const headerHeight = 50;
	drawBorder(margin, margin, contentWidth, headerHeight);

	// Company logo/name
	doc.setFontSize(28);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(50, 50, 50);
	doc.text(
		companySettings?.companyName || "Your Company",
		margin + 15,
		margin + 25,
	);

	// Company details
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(100, 100, 100);
	let companyY = margin + 35;
	if (companySettings?.addressLine1) {
		doc.text(companySettings.addressLine1, margin + 15, companyY);
		companyY += 5;
	}
	if (companySettings?.addressLine2) {
		doc.text(companySettings.addressLine2, margin + 15, companyY);
		companyY += 5;
	}
	if (
		companySettings?.city &&
		companySettings?.state &&
		companySettings?.postalCode
	) {
		doc.text(
			`${companySettings.city}, ${companySettings.state} ${companySettings.postalCode}`,
			margin + 15,
			companyY,
		);
		companyY += 5;
	}
	if (companySettings?.country) {
		doc.text(companySettings.country, margin + 15, companyY);
	}

	// Invoice title and details section
	const invoiceDetailsY = margin + headerHeight + 20;
	const invoiceDetailsHeight = 40;
	drawBorder(margin, invoiceDetailsY, contentWidth, invoiceDetailsHeight);

	// Invoice title
	doc.setFontSize(24);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(50, 50, 50);
	doc.text("INVOICE", margin + 15, invoiceDetailsY + 20);

	// Invoice details on the right
	doc.setFontSize(11);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(80, 80, 80);
	doc.text("Invoice Details", margin + contentWidth - 80, invoiceDetailsY + 15);

	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.text(
		`#${invoice.number}`,
		margin + contentWidth - 80,
		invoiceDetailsY + 25,
	);
	doc.text(
		`Issue: ${new Date(invoice.issueDate).toLocaleDateString()}`,
		margin + contentWidth - 80,
		invoiceDetailsY + 32,
	);
	doc.text(
		`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`,
		margin + contentWidth - 80,
		invoiceDetailsY + 39,
	);

	// Status badge
	const statusWidth = 40;
	const statusX = margin + contentWidth - statusWidth - 15;
	doc.setFillColor(
		invoice.status === "PAID" ? 34 : invoice.status === "PENDING" ? 251 : 239,
		invoice.status === "PAID" ? 197 : invoice.status === "PENDING" ? 191 : 68,
		invoice.status === "PAID" ? 94 : invoice.status === "PENDING" ? 36 : 68,
	);
	doc.rect(statusX, invoiceDetailsY + 15, statusWidth, 12);
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(9);
	doc.setFont("helvetica", "bold");
	doc.text(invoice.status, statusX + statusWidth / 2, invoiceDetailsY + 23, {
		align: "center",
	});

	// Client information section
	const clientY = invoiceDetailsY + invoiceDetailsHeight + 20;
	const clientHeight = 50;
	drawBorder(margin, clientY, contentWidth / 2 - 10, clientHeight);

	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(50, 50, 50);
	doc.text("Bill To:", margin + 15, clientY + 15);

	doc.setFontSize(11);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(80, 80, 80);
	let clientInfoY = clientY + 25;
	doc.text(invoice.client.name, margin + 15, clientInfoY);
	clientInfoY += 6;
	if (invoice.client.company) {
		doc.text(invoice.client.company, margin + 15, clientInfoY);
		clientInfoY += 6;
	}
	if (invoice.client.address) {
		doc.text(invoice.client.address, margin + 15, clientInfoY);
		clientInfoY += 6;
	}
	if (
		invoice.client.city &&
		invoice.client.state &&
		invoice.client.postalCode
	) {
		doc.text(
			`${invoice.client.city}, ${invoice.client.state} ${invoice.client.postalCode}`,
			margin + 15,
			clientInfoY,
		);
		clientInfoY += 6;
	}
	if (invoice.client.country) {
		doc.text(invoice.client.country, margin + 15, clientInfoY);
	}

	// Items table section
	const itemsY = clientY + clientHeight + 20;
	const tableHeaderHeight = 15;

	// Table header with background
	drawBorder(margin, itemsY, contentWidth, tableHeaderHeight);
	doc.setFontSize(11);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(50, 50, 50);
	doc.text("Item", margin + 15, itemsY + 10);
	doc.text("Description", margin + 80, itemsY + 10);
	doc.text("Qty", margin + 140, itemsY + 10);
	doc.text("Price", margin + 160, itemsY + 10);
	doc.text("Total", margin + 190, itemsY + 10);

	// Table content
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(80, 80, 80);
	let itemY = itemsY + tableHeaderHeight;
	let totalItemsHeight = 0;

	invoice.items.forEach((item, index) => {
		if (itemY > 250) {
			doc.addPage();
			itemY = 20;
		}

		// Draw row border
		drawBorder(margin, itemY - 2, contentWidth, 12);

		doc.text(item.name || "", margin + 15, itemY + 5);
		doc.text(item.description || "", margin + 80, itemY + 5);
		doc.text(item.quantity.toString(), margin + 140, itemY + 5);
		doc.text(`$${item.unitPrice.toFixed(2)}`, margin + 160, itemY + 5);
		doc.text(`$${item.total.toFixed(2)}`, margin + 190, itemY + 5);

		itemY += 12;
		totalItemsHeight += 12;
	});

	// Summary section
	const summaryY = Math.max(
		itemsY + tableHeaderHeight + totalItemsHeight + 20,
		280,
	);
	const summaryHeight = 80;
	drawBorder(
		margin + contentWidth / 2 + 10,
		summaryY,
		contentWidth / 2 - 10,
		summaryHeight,
	);

	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(50, 50, 50);
	doc.text("Summary", margin + contentWidth / 2 + 25, summaryY + 15);

	doc.setFontSize(11);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(80, 80, 80);
	let summaryInfoY = summaryY + 30;
	doc.text(`Subtotal:`, margin + contentWidth / 2 + 25, summaryInfoY);
	doc.text(
		`$${invoice.subtotal.toFixed(2)}`,
		margin + contentWidth - 25,
		summaryInfoY,
		{ align: "right" },
	);
	summaryInfoY += 8;

	if (invoice.discount > 0) {
		doc.text(`Discount:`, margin + contentWidth / 2 + 25, summaryInfoY);
		doc.text(
			`-$${invoice.discount.toFixed(2)}`,
			margin + contentWidth - 25,
			summaryInfoY,
			{ align: "right" },
		);
		summaryInfoY += 8;
	}

	if (invoice.tax > 0) {
		doc.text(`Tax:`, margin + contentWidth / 2 + 25, summaryInfoY);
		doc.text(
			`$${invoice.tax.toFixed(2)}`,
			margin + contentWidth - 25,
			summaryInfoY,
			{ align: "right" },
		);
		summaryInfoY += 8;
	}

	// Total with emphasis
	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(50, 50, 50);
	doc.text(`Total:`, margin + contentWidth / 2 + 25, summaryInfoY + 5);
	doc.text(
		`$${invoice.total.toFixed(2)}`,
		margin + contentWidth - 25,
		summaryInfoY + 5,
		{ align: "right" },
	);

	if (invoice.paidTotal > 0) {
		summaryInfoY += 20;
		doc.setFontSize(11);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(80, 80, 80);
		doc.text(`Paid:`, margin + contentWidth / 2 + 25, summaryInfoY);
		doc.text(
			`$${invoice.paidTotal.toFixed(2)}`,
			margin + contentWidth - 25,
			summaryInfoY,
			{ align: "right" },
		);
		summaryInfoY += 8;
		doc.text(`Balance Due:`, margin + contentWidth / 2 + 25, summaryInfoY);
		doc.text(
			`$${(invoice.total - invoice.paidTotal).toFixed(2)}`,
			margin + contentWidth - 25,
			summaryInfoY,
			{ align: "right" },
		);
	}

	// Notes section
	if (invoice.notes) {
		const notesY = summaryY + summaryHeight + 20;
		const notesHeight = 40;
		drawBorder(margin, notesY, contentWidth, notesHeight);

		doc.setFontSize(12);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(50, 50, 50);
		doc.text("Notes:", margin + 15, notesY + 15);

		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(80, 80, 80);
		const notesLines = doc.splitTextToSize(invoice.notes, contentWidth - 30);
		doc.text(notesLines, margin + 15, notesY + 25);
	}

	// Footer
	const footerY = doc.internal.pageSize.height - 20;
	doc.setFontSize(8);
	doc.setFont("helvetica", "normal");
	doc.setTextColor(150, 150, 150);
	doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY);

	return doc;
};

export const downloadInvoicePDF = (
	invoice: InvoiceWithRelations,
	companySettings: Setting | null,
) => {
	const doc = generateInvoicePDF(invoice, companySettings);
	doc.save(`invoice-${invoice.number}.pdf`);
};
