import { Setting } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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
	currencyCode: "",
	logoUrl: "",
	dateFormat: "MM/DD/YYYY",
	taxRate: new Decimal(0),
	invoicePrefix: "INV",
	nextInvoiceNumber: 1,
	updatedAt: new Date(),
};
