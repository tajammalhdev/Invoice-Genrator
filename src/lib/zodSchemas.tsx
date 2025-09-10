import { DiscountType } from "@prisma/client";
import { number, z } from "zod";

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
	id: z.string().optional(),
	companyName: z
		.string()
		.min(1, "Company name is required")
		.max(100, "Company name must be less than 100 characters"),
	companyEmail: z.string().max(100, "Email must be less than 100 characters"),
	companyPhone: z
		.string()
		.regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
		.optional(),
	logoUrl: z.string().optional(),
	addressLine1: z.string().optional(),
	addressLine2: z.string().optional(),
	city: z.string().optional(),
	state: z
		.string()

		.optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),
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
		.number()
		.min(1, "Quantity is required")
		.refine((val) => val > 0, "Quantity must be greater than 0")
		.refine((val) => val <= 999999, "Quantity is too large"),
	unitPrice: z
		.number()
		.min(1, "Unit price is required")
		.refine((val) => val >= 0, "Unit price must be 0 or greater")
		.refine((val) => val <= 999999, "Unit price is too large"),
	total: z.number().refine((val) => val >= 0, "Total must be 0 or greater"),
});

export const PaymentSchema = z.object({
	id: z.string().min(1, "ID is required").optional(),
	invoiceId: z.string().min(1, "Invoice ID is required"),
	amount: z.string().min(1, "Payment amount is required"),
	method: z.string().min(1, "Payment method is required"),
	receivedAt: z
		.string()
		.min(1, { message: "Payment date is required" })
		.transform((val) => new Date(val)),
});

export const InvoiceDetailsSchema = z.object({
	id: z.string().optional(),
	clientId: z.string().min(1, { message: "Client is required" }),
	number: z.string().min(1, { message: "invoice no. required" }),
	issueDate: z
		.string()
		.min(1, { message: "Issue date is required" })
		.transform((val) => new Date(val)),
	dueDate: z
		.string()
		.min(1, { message: "Due date is required" })
		.transform((val) => new Date(val)),
	notes: z.string().optional(),
	status: z
		.string()
		.optional()
		.refine(
			(val) => !val || Object.values(InvoiceStatus).includes(val as any),
			{
				message: "Invalid status value",
			},
		),
	items: z.array(ItemSchema),
	discount: z.string().optional(),
	discountType: z
		.string()
		.transform((val) => val.toUpperCase())
		.refine((val) => Object.values(DiscountType).includes(val as any), {
			message: "Invalid Discount Type value",
		}),
	discountAmount: z
		.string()
		.transform((val) => parseFloat(val) || 0)
		.optional(),
	subtotal: z.number(),
	total: z.number(),
	paymentTerm: z
		.string()
		.optional()
		.refine((val) => !val || Object.values(PaymentTerm).includes(val as any), {
			message: "Invalid Payment Terms value",
		}),
});

export type InvoiceDetails = z.infer<typeof InvoiceDetailsSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type PaymentSchemaValidation = z.infer<typeof PaymentSchema>;
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
