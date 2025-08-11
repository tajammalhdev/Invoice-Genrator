import { Setting } from "@prisma/client";

export type CreateSettingsInput = Omit<Setting, "id" | "userId" | "createdAt">;

export const defaultSettings: CreateSettingsInput = {
	companyName: "",
	companyEmail: "",
	companyPhone: "",
	addressLine1: "",
	addressLine2: "",
	city: "",
	state: "",
	postalCode: "",
	country: "",
	currencyCode: "USD",
	logoUrl: "",
	dateFormat: "MM/DD/YYYY",
	taxRate: 0,
	invoicePrefix: "INV",
	nextInvoiceNumber: 1,
	updatedAt: new Date(),
};

export type SettingsFormData = {
	companyName: string;
	companyEmail: string;
	companyPhone?: string;
	logoUrl?: string;
	addressLine1?: string;
	addressLine2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
	currencyCode: string;
	dateFormat: string;
	taxRate: number;
	invoicePrefix: string;
	nextInvoiceNumber: number;
};
