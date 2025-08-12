import { InvoiceStatus } from "@prisma/client";
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
const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
};

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

// Field Validators
export const fieldValidators = {
	// String validators
	name: v.pipe(
		v.string(),
		v.minLength(2, "Must be at least 2 characters"),
		v.maxLength(50, "Must be at most 50 characters"),
	),
	address: v.pipe(
		v.string(),
		v.minLength(2, "Must be at least 2 characters"),
		v.maxLength(70, "Must be at most 70 characters"),
	),
	zipCode: v.pipe(
		v.string(),
		v.minLength(2, "Must be at least 2 characters"),
		v.maxLength(20, "Must be at most 20 characters"),
	),
	city: v.pipe(
		v.string(),
		v.minLength(1, "Must be at least 1 character"),
		v.maxLength(50, "Must be at most 50 characters"),
	),
	country: v.pipe(
		v.string(),
		v.minLength(1, "Must be at least 1 character"),
		v.maxLength(70, "Must be at most 70 characters"),
	),
	email: v.pipe(
		v.string(),
		v.email("Email must be a valid email"),
		v.minLength(5, "Must be at least 5 characters"),
		v.maxLength(100, "Must be at most 100 characters"),
	),
	phone: v.pipe(
		v.string(),
		v.minLength(1, "Must be at least 1 character"),
		v.maxLength(20, "Must be at most 20 characters"),
	),

	// Number validators
	quantity: v.pipe(
		v.number(),
		v.minValue(1, "Must be a number greater than 0"),
	),
	unitPrice: v.pipe(
		v.number(),
		v.minValue(0.01, "Must be a number greater than 0"),
		v.maxValue(Number.MAX_SAFE_INTEGER, `Must be ≤ ${Number.MAX_SAFE_INTEGER}`),
	),
	nonNegativeNumber: v.pipe(
		v.number(),
		v.minValue(0, "Must be a positive number"),
	),

	// String validators
	string: v.string(),
	stringMin1: v.pipe(
		v.string(),
		v.minLength(1, "Must be at least 1 character"),
	),
	stringOptional: v.optional(v.string()),

	// Transform validators
	stringToNumber: v.pipe(
		v.string(),
		v.transform((val) => Number(val)),
	),
	stringToNumberWithMax: v.pipe(
		v.string(),
		v.transform((val) => Number(val)),
		v.maxValue(1000000, "Value must be 1,000,000 or less"),
	),
	// Dates
	date: v.pipe(
		v.string(), // Valibot doesn't have native `date()` parser, so store as string or transform
		v.transform((value) =>
			new Date(value).toLocaleDateString("en-US", DATE_OPTIONS),
		),
	),
};

export const ItemSchema = v.object({
	id: v.optional(v.string()),
	name: fieldValidators.stringMin1,
	description: fieldValidators.stringMin1,
	quantity: fieldValidators.quantity,
	unitPrice: fieldValidators.unitPrice,
	total: fieldValidators.stringToNumber,
});

const PaymentSchema = v.object({
	amount: fieldValidators.stringToNumber,
	method: fieldValidators.string,
	receivedAt: fieldValidators.date,
});
export const InvoiceDetailsSchema = v.object({
	invoiceNumber: fieldValidators.stringMin1,
	issueDate: fieldValidators.date,
	dueDate: fieldValidators.date,
	notes: fieldValidators.stringOptional,
	status: v.enum(InvoiceStatus),
	items: v.array(ItemSchema),
	payments: v.array(PaymentSchema),
	subtotal: fieldValidators.stringToNumber,
	tax: fieldValidators.stringToNumber,
	total: fieldValidators.stringToNumber,
	paidTotal: fieldValidators.stringToNumber,
	language: fieldValidators.string,
	currency: fieldValidators.string,
});

export type InvoiceDetails = v.InferOutput<typeof InvoiceDetailsSchema>;
export type Item = v.InferOutput<typeof ItemSchema>;
