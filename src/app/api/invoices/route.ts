import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InvoiceDetailsSchema } from "@/lib/zodSchemas";

export async function POST(request: NextRequest) {
	try {
		// Get the current user session
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse and validate the request body
		const body = await request.json();
		const validatedData = InvoiceDetailsSchema.parse(body);

		// Get user's company settings for invoice number generation
		const userSettings = await prisma.setting.findUnique({
			where: { userId: session.user.id },
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
					userId: session.user.id,
					clientId: validatedData.clientId,
					number: invoiceNumber,
					issueDate: validatedData.issueDate,
					dueDate: validatedData.dueDate,
					notes: validatedData.notes || "",
					status: validatedData.status as any,
					discount: validatedData.discount,
					subtotal: validatedData.subtotal,
					tax: validatedData.tax,
					total: validatedData.total,
					paymentTerm: validatedData.paymentTerm as any,
				},
			});

			// Create invoice items
			const invoiceItems = await Promise.all(
				validatedData.items.map((item) =>
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
				where: { userId: session.user.id },
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

export async function GET(request: NextRequest) {
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
