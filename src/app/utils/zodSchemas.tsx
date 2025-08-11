import * as v from "valibot";

// Main comprehensive schema for all settings
export const SettingsSchema = v.object({
	companyName: v.string("Company name is required"),
	companyEmail: v.pipe(
		v.string("Company email is required"),
		v.email("Invalid email address"),
	),
	companyPhone: v.optional(v.string()),
	logoUrl: v.optional(v.string()),
	addressLine1: v.optional(v.string()),
	addressLine2: v.optional(v.string()),
	city: v.optional(v.string()),
	state: v.optional(v.string()),
	postalCode: v.optional(v.string()),
	country: v.optional(v.string()),
	currencyCode: v.fallback(v.pipe(v.string(), v.minLength(1)), "USD"),
	dateFormat: v.fallback(v.pipe(v.string(), v.minLength(1)), "MM/DD/YYYY"),
	taxRate: v.fallback(v.pipe(v.number(), v.minValue(0)), 0),
	invoicePrefix: v.fallback(v.pipe(v.string(), v.minLength(1)), "INV"),
	nextInvoiceNumber: v.fallback(v.pipe(v.number(), v.minValue(1)), 1),
});

// Partial schemas for form sections
export const BasicInfoSchema = v.pick(SettingsSchema, [
	"companyName",
	"companyEmail",
	"companyPhone",
	"logoUrl",
]);

export const CompanyAddressSchema = v.pick(SettingsSchema, [
	"addressLine1",
	"addressLine2",
	"city",
	"state",
	"postalCode",
	"country",
]);

export const PreferencesSchema = v.pick(SettingsSchema, [
	"currencyCode",
	"dateFormat",
	"taxRate",
]);

export const InvoicingSchema = v.pick(SettingsSchema, [
	"invoicePrefix",
	"nextInvoiceNumber",
]);

// Type exports
export type Settings = v.InferOutput<typeof SettingsSchema>;
export type BasicInfo = v.InferOutput<typeof BasicInfoSchema>;
export type CompanyAddress = v.InferOutput<typeof CompanyAddressSchema>;
export type Preferences = v.InferOutput<typeof PreferencesSchema>;
export type Invoicing = v.InferOutput<typeof InvoicingSchema>;
