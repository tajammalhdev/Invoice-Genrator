"use server";
import { reqSession } from "@/app/utils/hooks";
import {
	SettingsSchema,
	BasicInfoSchema,
	CompanyAddressSchema,
	PreferencesSchema,
	InvoicingSchema,
} from "@/app/utils/zodSchemas";
import prisma from "@/lib/prisma";
import { parseWithValibot } from "@conform-to/valibot";
import { Settings } from "@/app/utils/zodSchemas";

export async function updateBasicSettings(prevState: any, formData: FormData) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const submission = parseWithValibot(formData, {
		schema: BasicInfoSchema,
	});
	if (submission.status !== "success") {
		return submission.reply();
	}

	const data = await prisma.setting.update({
		where: {
			userId: session?.user?.id,
		},
		data: submission.value,
	});

	return { success: true, data };
}

export async function updateCompanySettings(
	prevState: any,
	formData: FormData,
) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const submission = parseWithValibot(formData, {
		schema: CompanyAddressSchema,
	});
	if (submission.status !== "success") {
		return submission.reply();
	}

	const data = await prisma.setting.update({
		where: {
			userId: session?.user?.id,
		},
		data: submission.value,
	});

	return { success: true, data };
}

export async function updatePreferencesSettings(
	prevState: any,
	formData: FormData,
) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const submission = parseWithValibot(formData, {
		schema: PreferencesSchema,
	});
	if (submission.status !== "success") {
		return submission.reply();
	}

	const data = await prisma.setting.update({
		where: {
			userId: session?.user?.id,
		},
		data: submission.value,
	});

	return { success: true, data };
}

export async function updateInvoiceSettings(
	prevState: any,
	formData: FormData,
) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const submission = parseWithValibot(formData, {
		schema: InvoicingSchema,
	});
	if (submission.status !== "success") {
		return submission.reply();
	}

	const data = await prisma.setting.update({
		where: {
			userId: session?.user?.id,
		},
		data: submission.value,
	});

	return { success: true, data };
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
		companyPhone: settings.companyPhone || undefined,
		logoUrl: settings.logoUrl || undefined,
		addressLine1: settings.addressLine1 || undefined,
		addressLine2: settings.addressLine2 || undefined,
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
