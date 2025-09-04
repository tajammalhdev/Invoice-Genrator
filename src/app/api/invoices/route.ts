import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InvoiceItem } from "@prisma/client";

export async function POST(request: NextRequest) {
	try {
		// Get the current user session
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;

		// Parse and validate the request body
		const body = await request.json();

		// Use the raw body data directly (no validation needed since frontend handles it)
		const invoiceData = body;

		// Get user's company settings for invoice number generation
		const userSettings = await prisma.setting.findUnique({
			where: { userId },
		});

		if (!userSettings) {
			return NextResponse.json(
				{ error: "Company settings not found" },
				{ status: 400 },
			);
		}

		// Generate invoice number
		const invoiceNumber = `${
			userSettings.invoicePrefix
		}${userSettings.nextInvoiceNumber.toString().padStart(4, "0")}`;

		// Create the invoice with items in a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Create the invoice
			const invoice = await tx.invoice.create({
				data: {
					userId,
					clientId: invoiceData.clientId,
					number: invoiceNumber,
					issueDate: invoiceData.issueDate,
					dueDate: invoiceData.dueDate,
					notes: invoiceData.notes || "",
					status: invoiceData.status as any,
					discount: invoiceData.discount || 0,
					subtotal: invoiceData.subtotal,
					tax: invoiceData.tax,
					total: invoiceData.total,
					paymentTerm: invoiceData.paymentTerm as any,
				},
			});

			// Create invoice items
			const invoiceItems = await Promise.all(
				invoiceData.items.map((item: InvoiceItem) =>
					tx.invoiceItem.create({
						data: {
							invoiceId: invoice.id,
							name: item.name,
							description: item.description || "",
							quantity: item.quantity,
							unitPrice: item.unitPrice,
							total: item.total,
						},
					}),
				),
			);

			// Update the next invoice number
			await tx.setting.update({
				where: { userId },
				data: { nextInvoiceNumber: userSettings.nextInvoiceNumber + 1 },
			});

			return { invoice, items: invoiceItems };
		});

		return NextResponse.json(
			{
				message: "Invoice created successfully",
				invoice: result.invoice,
				items: result.items,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating invoice:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const invoices = await prisma.invoice.findMany({
			where: { userId: session.user.id },
			include: {
				client: true,
				items: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(invoices);
	} catch (error) {
		console.error("Error fetching invoices:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json(
				{
					message: "Unauthorized access",
				},
				{
					status: 401,
				},
			);
		}

		const userId = session?.user?.id;

		// Parse and validate the request body
		const body = await request.json();

		// Use the raw body data directly (no validation needed since frontend handles it)
		const invoiceData = body;

		// Get user's company settings for invoice number generation
		const userSettings = await prisma.setting.findUnique({
			where: { userId },
		});

		if (!userSettings) {
			return NextResponse.json(
				{ error: "Company settings not found" },
				{ status: 400 },
			);
		}

		// Create the invoice with items in a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Create the invoice
			const invoice = await tx.invoice.update({
				where: { id: invoiceData.invoiceId },
				data: {
					userId,
					clientId: invoiceData.clientId,
					number: invoiceData.invoiceNumber,
					issueDate: new Date(invoiceData.issueDate),
					dueDate: new Date(invoiceData.dueDate),
					notes: invoiceData.notes || "",
					status: invoiceData.status as any,
					discount: invoiceData.discount || 0,
					subtotal: invoiceData.subtotal,
					tax: invoiceData.tax,
					total: invoiceData.total,
					paymentTerm: invoiceData.paymentTerm as any,
				},
			});

			// Get existing items for this invoice
			const existingItems = await tx.invoiceItem.findMany({
				where: { invoiceId: invoiceData.invoiceId },
			});

			// Get IDs of items that are still in the form
			const formItemIds = invoiceData.items
				.filter((item: any) => item.id)
				.map((item: any) => item.id);

			// Delete items that are no longer in the form
			const itemsToDelete = existingItems.filter(
				(item) => !formItemIds.includes(item.id),
			);

			if (itemsToDelete.length > 0) {
				await tx.invoiceItem.deleteMany({
					where: {
						id: { in: itemsToDelete.map((item) => item.id) },
					},
				});
			}

			// Update or create items
			await Promise.all(
				invoiceData.items.map(async (item: any) => {
					if (item.id) {
						// Update existing item
						return tx.invoiceItem.update({
							where: { id: item.id },
							data: {
								name: item.name,
								description: item.description || "",
								quantity: item.quantity,
								unitPrice: item.unitPrice,
								total: item.total,
							},
						});
					} else {
						// Create new item
						return tx.invoiceItem.create({
							data: {
								invoiceId: invoiceData.invoiceId,
								name: item.name,
								description: item.description || "",
								quantity: item.quantity,
								unitPrice: item.unitPrice,
								total: item.total,
							},
						});
					}
				}),
			);

			// Update the next invoice number
			await tx.setting.update({
				where: { userId },
				data: { nextInvoiceNumber: userSettings.nextInvoiceNumber + 1 },
			});
		});

		return NextResponse.json({ message: "Invoice updated successfully" });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error", message: error },
			{ status: 500 },
		);
	}
}
