import { InvoiceStatus } from "@prisma/client";
import { z } from "zod";

// Field Validators
export const fieldValidators = {
	// String validators
	name: z
		.string()
		.min(2, "Must be at least 2 characters")
		.max(50, "Must be at most 50 characters"),
	address: z
		.string()
		.min(2, "Must be at least 2 characters")
		.max(70, "Must be at most 70 characters"),
	optionalAddress: z
		.string()
		.min(2, "Must be at least 2 characters")
		.max(70, "Must be at most 70 characters")
		.optional(),
	zipCode: z
		.string()
		.min(2, "Must be at least 2 characters")
		.max(20, "Must be at most 20 characters"),
	optionalZipCode: z
		.string()
		.min(2, "Must be at least 2 characters")
		.max(20, "Must be at most 20 characters")
		.optional(),
	city: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(50, "Must be at most 50 characters"),
	optionalCity: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(50, "Must be at most 50 characters")
		.optional(),
	country: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(70, "Must be at most 70 characters"),
	optionalCountry: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(70, "Must be at most 70 characters")
		.optional(),
	email: z
		.string()
		.email("Email must be a valid email")
		.min(5, "Must be at least 5 characters")
		.max(100, "Must be at most 100 characters"),
	phone: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(20, "Must be at most 20 characters"),
	optionalPhone: z.string().optional(),
	quantity: z.number().min(1, "Must be a number greater than 0"),
	unitPrice: z
		.number()
		.min(0.01, "Must be a number greater than 0")
		.max(Number.MAX_SAFE_INTEGER, `Must be ≤ ${Number.MAX_SAFE_INTEGER}`),
	nonNegativeNumber: z.number().min(0, "Must be a positive number"),

	// String validators
	string: z.string(),
	stringMin1: z.string().min(1, "Must be at least 1 character"),
	stringOptional: z.string().optional(),

	// Transform validators
	stringToNumber: z.string().transform((val) => Number(val)),
	stringToNumberWithMax: z
		.string()
		.transform((val) => Number(val))
		.pipe(z.number().max(1000000, "Value must be 1,000,000 or less")),
	// Dates
	date: z
		.string()
		.transform((value) =>
			new Date(value).toLocaleDateString("en-US", DATE_OPTIONS),
		),
};

// Main comprehensive schema for all settings
export const SettingsSchema = z.object({
	companyName: fieldValidators.name.optional(),
	companyEmail: fieldValidators.email.optional(),
	companyPhone: fieldValidators.phone.optional(),
	logoUrl: fieldValidators.stringOptional,
	addressLine1: fieldValidators.address.optional(),
	addressLine2: fieldValidators.address.optional(),
	city: fieldValidators.optionalCity,
	state: fieldValidators.optionalAddress,
	postalCode: fieldValidators.optionalZipCode,
	country: fieldValidators.optionalCountry,
	currencyCode: z.string().optional(),
	dateFormat: z.string().optional(),
	taxRate: z.number().optional(),
	invoicePrefix: z.string().optional(),
	nextInvoiceNumber: z.number().optional(),
});

// Partial schemas for form sections
const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
};

// Type exports
export type Settings = z.infer<typeof SettingsSchema>;

export const ItemSchema = z.object({
	id: z.string().optional(),
	name: fieldValidators.stringMin1,
	description: fieldValidators.stringMin1,
	quantity: fieldValidators.quantity,
	unitPrice: fieldValidators.unitPrice,
	total: fieldValidators.stringToNumber,
});

const PaymentSchema = z.object({
	amount: fieldValidators.stringToNumber,
	method: fieldValidators.string,
	receivedAt: fieldValidators.date,
});

export const InvoiceDetailsSchema = z.object({
	invoiceNumber: fieldValidators.stringMin1,
	issueDate: fieldValidators.date,
	dueDate: fieldValidators.date,
	notes: fieldValidators.stringOptional,
	status: z.enum(InvoiceStatus),
	items: z.array(ItemSchema),
	payments: z.array(PaymentSchema),
	subtotal: fieldValidators.stringToNumber,
	tax: fieldValidators.stringToNumber,
	total: fieldValidators.stringToNumber,
	paidTotal: fieldValidators.stringToNumber,
	language: fieldValidators.string,
	currency: fieldValidators.string,
});

export type InvoiceDetails = z.infer<typeof InvoiceDetailsSchema>;
export type Item = z.infer<typeof ItemSchema>;
