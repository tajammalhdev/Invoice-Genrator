export const ITEM_PER_PAGE = 10;

export const emailTemplates = {
	initial: {
		subject: "Invoice #{invoiceNumber} from {companyName}",
		message:
			"Please find attached invoice #{invoiceNumber} for the services provided. Payment is due by {dueDate}. Thank you for your business!",
	},
	"first-reminder": {
		subject: "Reminder: Invoice #{invoiceNumber} - Payment Due",
		message:
			"This is a friendly reminder that invoice #{invoiceNumber} is due for payment. The due date was {dueDate}. Please process this payment at your earliest convenience.",
	},
	"second-reminder": {
		subject: "Second Reminder: Invoice #{invoiceNumber} - Payment Overdue",
		message:
			"Invoice #{invoiceNumber} is now overdue. The original due date was {dueDate}. Please arrange payment as soon as possible to avoid any late fees.",
	},
	"third-reminder": {
		subject:
			"Final Notice: Invoice #{invoiceNumber} - Immediate Payment Required",
		message:
			"This is our final notice regarding invoice #{invoiceNumber}. Payment is significantly overdue (due date: {dueDate}). Please contact us immediately to arrange payment or discuss payment terms.",
	},
};
