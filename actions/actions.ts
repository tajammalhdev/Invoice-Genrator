"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
	Clients,
	PaymentSchemaValidation,
	InvoiceDetails,
} from "@/lib/zodSchemas";
import { InvoiceStatus, PaymentTerm } from "@prisma/client";
import { sendInvoiceEmail as sendInvoiceEmailService } from "@/lib/emailService";
import { NextResponse } from "next/server";

type CurrentState = { success: boolean; error: unknown };

export const deleteClient = async (
	currentState: CurrentState,
	data: FormData,
) => {
	const id = data.get("id") as string;
	try {
		await prisma.client.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const createClient = async (
	currentState: CurrentState,
	data: Clients,
) => {
	const session = await auth();
	try {
		await prisma.client.create({
			data: {
				...data,
				user: {
					connect: {
						id: session?.user?.id,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const updateClient = async (
	currentState: CurrentState,
	data: Clients,
) => {
	const session = await auth();
	try {
		await prisma.client.update({
			where: {
				id: data.id,
			},
			data: {
				...data,
				user: {
					connect: {
						id: session?.user?.id,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const createPayment = async (
	currentState: CurrentState,
	data: PaymentSchemaValidation,
) => {
	try {
		await prisma.payment.create({
			data: {
				amount: parseFloat(data.amount),
				method: data.method,
				receivedAt: data.receivedAt,
				invoice: {
					connect: {
						number: data.invoiceId,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: err };
	}
};

export const updatePayment = async (
	currentState: CurrentState,
	data: PaymentSchemaValidation,
) => {
	const session = await auth();
	try {
		await prisma.payment.update({
			where: {
				id: data.id,
			},
			data: {
				amount: parseFloat(data.amount),
				method: data.method,
				receivedAt: data.receivedAt,
				invoice: {
					connect: {
						number: data.invoiceId,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};
export const deletePayment = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		const id = data.get("id") as string;
		await prisma.payment.delete({
			where: {
				id: id,
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const createInvoice = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		const session = await auth();
		const invoice = await prisma.invoice.create({
			data: {
				number: data.get("number") as string,
				issueDate: new Date(data.get("issueDate") as string),
				dueDate: new Date(data.get("dueDate") as string),
				status: data.get("status") as InvoiceStatus,
				notes: data.get("notes") as string,
				discount: parseFloat(data.get("discount") as string) || 0,
				subtotal: parseFloat(data.get("subtotal") as string) || 0,
				tax: parseFloat(data.get("tax") as string) || 0,
				total: parseFloat(data.get("total") as string) || 0,
				paymentTerm: data.get("paymentTerm") as PaymentTerm,
				client: {
					connect: {
						id: data.get("clientId") as string,
					},
				},
				user: {
					connect: {
						id: session?.user?.id,
					},
				},
			},
		});

		// Create invoice items separately
		const items = JSON.parse((data.get("items") as string) || "[]");
		if (items.length > 0) {
			await prisma.invoiceItem.createMany({
				data: items.map((item: any) => ({
					invoiceId: invoice.id,
					name: item.name,
					description: item.description,
					quantity: parseInt(item.quantity) || 0,
					unitPrice: parseFloat(item.unitPrice) || 0,
					total: parseFloat(item.total) || 0,
				})),
			});
		}

		return { success: true, error: false, invoiceId: invoice.id };
	} catch (err) {
		return { success: false, error: true };
	}
};
export const updateInvoice = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		const session = await auth();
		const invoiceId = data.get("id") as string;
		console.log("Update invoice - ID:", invoiceId);
		console.log(
			"Update invoice - FormData entries:",
			Array.from(data.entries()),
		);

		if (!invoiceId) {
			return { success: false, error: "Invoice ID is required" };
		}

		const invoice = await prisma.invoice.update({
			where: {
				id: invoiceId,
			},
			data: {
				number: data.get("number") as string,
				issueDate: new Date(data.get("issueDate") as string),
				dueDate: new Date(data.get("dueDate") as string),
				status: data.get("status") as InvoiceStatus,
				notes: data.get("notes") as string,
				discount: parseFloat(data.get("discount") as string) || 0,
				subtotal: parseFloat(data.get("subtotal") as string) || 0,
				total: parseFloat(data.get("total") as string) || 0,
				paymentTerm: data.get("paymentTerm") as PaymentTerm,
				client: {
					connect: {
						id: data.get("clientId") as string,
					},
				},
			},
		});

		// Update invoice items - delete existing and create new ones
		await prisma.invoiceItem.deleteMany({
			where: {
				invoiceId: invoice.id,
			},
		});

		const items = JSON.parse((data.get("items") as string) || "[]");
		if (items.length > 0) {
			await prisma.invoiceItem.createMany({
				data: items.map((item: any) => ({
					invoiceId: invoice.id,
					name: item.name,
					description: item.description,
					quantity: parseInt(item.quantity) || 0,
					unitPrice: parseFloat(item.unitPrice) || 0,
					total: parseFloat(item.total) || 0,
				})),
			});
		}
		return { success: true, error: false, invoiceId: invoice.id };
	} catch (err) {
		console.error("Update invoice error:", err);
		return { success: false, error: err };
	}
};
export const deleteInvoice = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		const id = data.get("id") as string;
		await prisma.invoice.delete({
			where: {
				id: id,
			},
			include: {
				items: true,
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const sendInvoiceEmail = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		const invoice = JSON.parse(data.get("invoice") as string);
		const clientEmail = data.get("clientEmail") as string;
		const clientName = data.get("clientName") as string;
		const subject = data.get("subject") as string;
		const message = data.get("message") as string;
		const template = data.get("template") as string;
		const invoiceId = data.get("invoiceId") as string;

		const result = await sendInvoiceEmailService({
			invoice,
			clientEmail,
			clientName,
			subject,
			message,
		});

		if (result.success) {
			return { success: true, error: false };
		} else {
			return { success: false, error: true };
		}
	} catch (err) {
		return { success: false, error: true };
	}
};

export const uploadLogo = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		await prisma.setting.update({
			where: { id: data.get("id") as string },
			data: {
				logoUrl: data.get("logoUrl") as string,
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: err };
	}
};
export const updateCompany = async (
	currentState: CurrentState,
	data: FormData,
) => {
	try {
		await prisma.setting.update({
			where: { id: data.get("id") as string },
			data: {
				companyName: data.get("companyName") as string,
				companyEmail: data.get("companyEmail") as string,
				companyPhone: data.get("companyPhone") as string,
				addressLine1: data.get("addressLine1") as string,
				addressLine2: data.get("addressLine2") as string,
				city: data.get("city") as string,
				state: data.get("state") as string,
				postalCode: data.get("postalCode") as string,
				country: data.get("country") as string,
				logoUrl: data.get("logoUrl") as string,
				currency: (data.get("currency") as string) || "USD",
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: err };
	}
};
