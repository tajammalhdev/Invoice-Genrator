import { z } from "zod";

// Manual enum definitions since Prisma client doesn't include them yet
const InvoiceStatus = {
	DRAFT: "DRAFT",
	PENDING: "PENDING",
	PAID: "PAID",
	OVERDUE: "OVERDUE",
} as const;

const PaymentTerm = {
	NET1: "NET1",
	NET7: "NET7",
	NET14: "NET14",
	NET30: "NET30",
} as const;

// Main comprehensive schema for all settings
export const SettingsSchema = z.object({
	companyName: z
		.string()
		.min(1, "Company name is required")
		.max(100, "Company name must be less than 100 characters"),
	companyEmail: z
		.string()
		.min(1, "Company email is required")
		.email("Please enter a valid email address")
		.max(100, "Email must be less than 100 characters"),
	companyPhone: z
		.string()
		.min(1, "Company phone is required")
		.regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
	logoUrl: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	addressLine1: z
		.string()
		.min(1, "Address line 1 is required")
		.max(100, "Address must be less than 100 characters")
		.optional()
		.or(z.literal("")),
	addressLine2: z
		.string()
		.max(100, "Address must be less than 100 characters")
		.optional()
		.or(z.literal("")),
	city: z
		.string()
		.min(1, "City is required")
		.max(50, "City must be less than 50 characters")
		.optional()
		.or(z.literal("")),
	state: z
		.string()
		.min(1, "State is required")
		.max(50, "State must be less than 50 characters")
		.optional()
		.or(z.literal("")),
	postalCode: z
		.string()
		.min(1, "Postal code is required")
		.max(20, "Postal code must be less than 20 characters")
		.optional()
		.or(z.literal("")),
	country: z
		.string()
		.min(1, "Country is required")
		.max(50, "Country must be less than 50 characters")
		.optional()
		.or(z.literal("")),
	currencyCode: z
		.string()
		.min(1, "Currency code is required")
		.max(3, "Currency code must be 3 characters")
		.optional(),
	dateFormat: z
		.string()
		.min(1, "Date format is required")
		.max(20, "Date format must be less than 20 characters")
		.optional(),
	taxRate: z
		.number()
		.min(0, "Tax rate must be 0 or greater")
		.max(100, "Tax rate cannot exceed 100%")
		.optional(),

	invoicePrefix: z
		.string()
		.min(1, "Invoice prefix is required")
		.max(10, "Invoice prefix must be less than 10 characters")
		.optional(),
	nextInvoiceNumber: z
		.number()
		.min(1, "Invoice number must be 1 or greater")
		.optional(),
});

// Partial schemas for form sections
const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
};

// Type exports
export type Settings = z.infer<typeof SettingsSchema>;

// Export enums for use in other components
export { InvoiceStatus, PaymentTerm };

export const ItemSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, "Item name is required")
		.max(100, "Item name must be less than 100 characters"),
	description: z.string().optional(),
	quantity: z
		.string()
		.min(1, "Quantity is required")
		.transform((val) => parseFloat(val) || 0)
		.refine((val) => val > 0, "Quantity must be greater than 0")
		.refine((val) => val <= 999999, "Quantity is too large"),
	unitPrice: z
		.string()
		.min(1, "Unit price is required")
		.transform((val) => parseFloat(val) || 0)
		.refine((val) => val >= 0, "Unit price must be 0 or greater")
		.refine((val) => val <= 999999, "Unit price is too large"),
	total: z
		.string()
		.transform((val) => parseFloat(val) || 0)
		.refine((val) => val >= 0, "Total must be 0 or greater"),
});

const PaymentSchema = z.object({
	amount: z.string().min(1, "Payment amount is required"),
	method: z.string().min(1, "Payment method is required"),
	receivedAt: z.date({ message: "Payment date is required" }),
});

export const InvoiceDetailsSchema = z.object({
	clientId: z.string().min(1, { message: "Client is required" }),
	invoiceNumber: z.string().min(1, { message: "invoice no. required" }),
	issueDate: z
		.string()
		.min(1, { message: "Issue date is required" })
		.transform((val) => new Date(val)),
	dueDate: z
		.string()
		.min(1, { message: "Due date is required" })
		.transform((val) => new Date(val)),
	notes: z.string().optional(),
	status: z.enum(Object.values(InvoiceStatus) as [string, ...string[]]),
	items: z.array(ItemSchema),
	payments: z.array(PaymentSchema),
	subtotal: z.string().transform((val) => parseFloat(val) || 0),
	discount: z
		.string()
		.transform((val) => parseFloat(val) || 0)
		.optional(),
	tax: z.string().transform((val) => parseFloat(val) || 0),
	total: z.string().transform((val) => parseFloat(val) || 0),
	paidTotal: z.string().transform((val) => parseFloat(val) || 0),
	paymentTerm: z.enum(Object.values(PaymentTerm) as [string, ...string[]]),
	language: z.string().min(1, "Language is required"),
	currency: z.string().min(1, "Currency is required"),
});

export type InvoiceDetails = z.infer<typeof InvoiceDetailsSchema>;
export type Item = z.infer<typeof ItemSchema>;

// Client Schema
export const ClientSchema = z.object({
	id: z.string().min(1, "ID is required").optional(),
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.max(100, "Email must be less than 100 characters"),
	company: z
		.string()
		.min(1, "Company is required")
		.max(100, "Company must be less than 100 characters"),
	phone: z
		.string()
		.min(1, "Phone is required")
		.regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
		.max(20, "Phone must be less than 20 characters"),
	address: z
		.string()
		.min(1, "Address is required")
		.max(200, "Address must be less than 200 characters"),
	city: z
		.string()
		.min(1, "City is required")
		.max(50, "City must be less than 50 characters"),
	state: z
		.string()
		.min(1, "State is required")
		.max(50, "State must be less than 50 characters"),
	postalCode: z
		.string()
		.min(1, "Postal code is required")
		.max(20, "Postal code must be less than 20 characters"),
	country: z
		.string()
		.min(1, "Country is required")
		.max(50, "Country must be less than 50 characters"),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type Clients = z.infer<typeof ClientSchema>;
