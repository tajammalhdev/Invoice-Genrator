"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Invoice, Setting } from "@prisma/client";

interface SendInvoiceEmailDialogProps {
	isOpen: boolean;
	onClose: () => void;
	invoice: Invoice | null;
	companySettings: Setting | null;
	clientEmail?: string;
	clientName?: string;
}

const emailTemplates = {
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

export default function SendInvoiceEmailDialog({
	isOpen,
	onClose,
	invoice,
	companySettings,
	clientEmail: defaultClientEmail = "",
	clientName: defaultClientName = "",
}: SendInvoiceEmailDialogProps) {
	const [selectedTemplate, setSelectedTemplate] = useState("initial");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	// Auto-populate subject and message when template changes
	const handleTemplateChange = (templateKey: string) => {
		setSelectedTemplate(templateKey);
		const template = emailTemplates[templateKey as keyof typeof emailTemplates];
		if (!invoice) return;
		if (template) {
			const dueDate = new Date(invoice.dueDate).toLocaleDateString();
			const newSubject = template.subject
				.replace("{invoiceNumber}", invoice?.number || "")
				.replace(
					"{companyName}",
					companySettings?.companyName || "Your Company",
				);

			const newMessage = template.message
				.replace("{invoiceNumber}", invoice?.number || "")
				.replace("{dueDate}", dueDate);

			setSubject(newSubject);
			setMessage(newMessage);
		}
	};

	// Initialize with default template when dialog opens
	useEffect(() => {
		if (isOpen && invoice) {
			handleTemplateChange("initial");
		}
	}, [isOpen, invoice]);

	const handleSendEmail = async () => {
		if (!defaultClientEmail.trim()) {
			toast.error(
				"No client email found. Please add an email to the client first.",
			);
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/invoices/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					invoice,
					companySettings,
					clientEmail: defaultClientEmail.trim(),
					clientName: defaultClientName,
					subject: subject.trim(),
					message: message.trim(),
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				toast.success("Invoice email sent successfully!");
				setTimeout(() => {
					onClose();
					setIsSuccess(false);
				}, 2000);
			} else {
				toast.error(result.error || "Failed to send email");
			}
		} catch (error) {
			console.error("Error sending email:", error);
			toast.error("Failed to send email. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			setSelectedTemplate("initial");
			setSubject("");
			setMessage("");
			setIsSuccess(false);
			onClose();
		}
	};

	// Check if client has email
	if (!defaultClientEmail.trim()) {
		return (
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Mail className="h-5 w-5 text-red-600" />
							No Client Email Found
						</DialogTitle>
						<DialogDescription>
							This client doesn't have an email address. Please add an email to
							the client first.
						</DialogDescription>
					</DialogHeader>

					<div className="bg-red-50 p-4 rounded-lg">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
							<div className="text-sm text-red-800">
								<p className="font-medium mb-1">Action Required:</p>
								<p>
									Add an email address to client "{defaultClientName}" in the
									Clients section before sending invoices.
								</p>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={handleClose}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Mail className="h-5 w-5 text-blue-600" />
						Send Invoice Email
					</DialogTitle>
					<DialogDescription>
						Send invoice #{invoice?.number} to {defaultClientName} (
						{defaultClientEmail})
					</DialogDescription>
				</DialogHeader>

				{isSuccess ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<CheckCircle className="h-16 w-16 text-green-600 mb-4" />
						<h3 className="text-lg font-semibold text-green-800 mb-2">
							Email Sent Successfully!
						</h3>
						<p className="text-green-600">
							The invoice has been sent to {defaultClientEmail}
						</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="template">Email Template</Label>
							<Select
								value={selectedTemplate}
								onValueChange={handleTemplateChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select template" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="initial">Initial Email</SelectItem>
									<SelectItem value="first-reminder">First Reminder</SelectItem>
									<SelectItem value="second-reminder">
										Second Reminder
									</SelectItem>
									<SelectItem value="third-reminder">Third Reminder</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject">Subject</Label>
							<Input
								id="subject"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								rows={4}
								disabled={isLoading}
							/>
						</div>

						<div className="bg-blue-50 p-4 rounded-lg">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
								<div className="text-sm text-blue-800">
									<p className="font-medium mb-1">What will be included:</p>
									<ul className="space-y-1 text-blue-700">
										<li>• Professional invoice email template</li>
										<li>• Invoice details and total amount</li>
										<li>• Link to view invoice online</li>
										<li>• Your company branding</li>
										<li>• Custom message based on template</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				)}

				<DialogFooter>
					{!isSuccess && (
						<>
							<Button
								variant="outline"
								onClick={handleClose}
								disabled={isLoading}>
								Cancel
							</Button>
							<Button
								onClick={handleSendEmail}
								disabled={isLoading}
								className="bg-blue-600 hover:bg-blue-700">
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Mail className="mr-2 h-4 w-4" />
										Send Email
									</>
								)}
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
