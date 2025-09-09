import nodemailer from "nodemailer";
import { Invoice, Setting } from "@prisma/client";

export interface EmailInvoiceData {
	invoice: Invoice;
	clientEmail: string;
	clientName: string;
	subject?: string;
	message?: string;
}

export const sendInvoiceEmail = async (data: EmailInvoiceData) => {
	try {
		const {
			invoice,
			clientEmail,
			clientName,
			subject: customSubject,
			message: customMessage,
		} = data;

		// Create transporter using environment variables
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || "587"),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		const subject =
			customSubject || `Invoice #${invoice.number} from Your Company`;

		const htmlContent = `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Invoice #${invoice.number}</title>
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
						.company-name { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
						.invoice-details { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
						.invoice-number { font-size: 20px; font-weight: bold; margin-bottom: 15px; }
						.detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
						.total { font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 15px; }
						.footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
						.cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							
							<div class="company-name"></div>
							<p>Thank you for your business!</p>
						</div>
						
						<div class="invoice-details">
							<div class="invoice-number">Invoice #${invoice.number}</div>
							
							<div class="detail-row">
								<span>Issue Date:</span>
								<span>${new Date(invoice.issueDate).toLocaleDateString()}</span>
							</div>
							
							<div class="detail-row">
								<span>Due Date:</span>
								<span>${new Date(invoice.dueDate).toLocaleDateString()}</span>
							</div>
							
							<div class="detail-row">
								<span>Status:</span>
								<span style="color: ${
									invoice.status === "PAID"
										? "#059669"
										: invoice.status === "PENDING"
										? "#d97706"
										: "#dc2626"
								}">${invoice.status}</span>
							</div>
							
							<div class="detail-row">
								<span>Subtotal:</span>
								<span>$${invoice.subtotal?.toFixed(2) || "0.00"}</span>
							</div>
							
							${
								invoice.discount
									? `<div class="detail-row"><span>Discount:</span><span>$${invoice.discount.toFixed(
											2,
									  )}</span></div>`
									: ""
							}
							${
								invoice.tax
									? `<div class="detail-row"><span>Tax:</span><span>$${invoice.tax.toFixed(
											2,
									  )}</span></div>`
									: ""
							}
							
							<div class="total">
								<div class="detail-row">
									<span>Total Amount:</span>
									<span>$${invoice.total?.toFixed(2) || "0.00"}</span>
								</div>
							</div>
						</div>
						
						<div style="text-align: center;">
							<a href="${process.env.NEXTAUTH_URL}/invoices/${
			invoice.id
		}" class="cta-button">View Invoice Online</a>
						</div>
						
						${
							customMessage
								? `<div class="custom-message" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
							<p style="margin: 0; font-style: italic; color: #374151;">${customMessage}</p>
						</div>`
								: ""
						}
						
						<div class="footer">
							<p>If you have any questions, please don't hesitate to contact us.</p>
						</div>
					</div>
				</body>
			</html>
		`;

		const mailOptions = {
			from: process.env.SMTP_FROM || "noreply@yourcompany.com",
			to: clientEmail,
			subject: subject,
			html: htmlContent,
		};

		const result = await transporter.sendMail(mailOptions);

		return { success: true, data: result };
	} catch (error) {
		console.error("Error sending invoice email:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};
