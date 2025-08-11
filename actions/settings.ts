"use server";
import { reqSession } from "@/app/utils/hooks";
import {
	BasicInformationSchema,
	CompanyInformationSchema,
	InvoiceInformationSchema,
	PreferencesSchema,
} from "@/app/utils/zodSchemas";
import prisma from "@/lib/prisma";
import { parseWithValibot } from "@conform-to/valibot";

export async function updateBasicSettings(prevState: any, formData: FormData) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const submission = parseWithValibot(formData, {
		schema: BasicInformationSchema,
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
		schema: CompanyInformationSchema,
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
		schema: InvoiceInformationSchema,
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

export async function getSettings(userId: string) {
	const session = await reqSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const settings = await prisma.setting.findUnique({
		where: {
			userId,
		},
	});

	return settings;
}
