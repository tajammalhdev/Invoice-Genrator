import * as v from "valibot";

export const BasicInformationSchema = v.object({
	companyName: v.string("Company name is required"),
	companyEmail: v.pipe(
		v.string("Company email is required"),
		v.email("Invalid email address"),
	),
	companyPhone: v.optional(v.string()),
	logoUrl: v.optional(v.string()),
});

export type BasicInfoSchema = v.InferOutput<typeof BasicInformationSchema>;

export const CompanyInformationSchema = v.object({
	addressLine1: v.optional(v.string()),
	addressLine2: v.optional(v.string()),
	city: v.optional(v.string()),
	state: v.optional(v.string()),
	postalCode: v.optional(v.string()),
	country: v.optional(v.string()),
});
export type CompanyInfoSchema = v.InferOutput<typeof CompanyInformationSchema>;

export const PreferencesSchema = v.object({
	currencyCode: v.fallback(v.pipe(v.string(), v.minLength(1)), "USD"),
	dateFormat: v.fallback(v.pipe(v.string(), v.minLength(1)), "MM/DD/YYYY"),
	taxRate: v.fallback(v.pipe(v.number(), v.minValue(0)), 0),
});
export type PreferencesInfoSchema = v.InferOutput<typeof PreferencesSchema>;

export const InvoiceInformationSchema = v.object({
	invoicePrefix: v.fallback(v.pipe(v.string(), v.minLength(1)), "INV"),
	nextInvoiceNumber: v.fallback(v.pipe(v.number(), v.minValue(1)), 1),
});
export type InvoiceInfoSchema = v.InferOutput<typeof InvoiceInformationSchema>;
