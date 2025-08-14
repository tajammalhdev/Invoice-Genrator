"use server";
import { reqSession } from "@/lib/hooks";
import { SettingsSchema } from "@/lib/zodSchemas";
import prisma from "@/lib/prisma";
import { Settings } from "@/lib/zodSchemas";

export async function updateBasicSettings(prevState: any, formData: FormData) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	return { success: true };
}

export async function updateCompanySettings(
	prevState: any,
	formData: FormData,
) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	return { success: true };
}

export async function getSettings(userId: string): Promise<Settings | null> {
	const session = await reqSession();
	if (!session) {
		return null;
	}

	const settings = await prisma.setting.findUnique({
		where: {
			userId,
		},
	});

	if (!settings) return null;

	// Transform Prisma types to match our schema types
	return {
		companyName: settings.companyName,
		companyEmail: settings.companyEmail,
		companyPhone: settings.companyPhone || "",
		logoUrl: settings.logoUrl || "",
		addressLine1: settings.addressLine1 || "",
		addressLine2: settings.addressLine2 || "",
		city: settings.city || undefined,
		state: settings.state || undefined,
		postalCode: settings.postalCode || undefined,
		country: settings.country || undefined,
		currencyCode: settings.currencyCode,
		dateFormat: settings.dateFormat,
		taxRate: Number(settings.taxRate),
		invoicePrefix: settings.invoicePrefix,
		nextInvoiceNumber: settings.nextInvoiceNumber,
	};
}
