import {
	Dispatch,
	SetStateAction,
	startTransition,
	useActionState,
	useEffect,
	useState,
} from "react";
import { FormProps } from "../FormModal";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { emailTemplates } from "@/lib/constants";
import { sendInvoiceEmail } from "../../../../actions/actions";
import { toast } from "sonner";

export default function EmailForm({
	type,
	data,
	setOpen,
	relatedData,
}: FormProps) {
	const [selectedTemplate, setSelectedTemplate] = useState("initial");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");

	const handleTemplateChange = (templateKey: string) => {
		setSelectedTemplate(templateKey);
		const template = emailTemplates[templateKey as keyof typeof emailTemplates];
		if (!relatedData) return;
		if (template) {
			const dueDate = new Date(relatedData.dueDate).toLocaleDateString();
			const newSubject = template.subject
				.replace("{invoiceNumber}", relatedData?.number || "")
				.replace("{companyName}", relatedData?.companyName || "Your Company");

			const newMessage = template.message
				.replace("{invoiceNumber}", relatedData?.number || "")
				.replace("{dueDate}", dueDate);

			setSubject(newSubject);
			setMessage(newMessage);
		}
	};
	// Initialize with default template when dialog opens
	useEffect(() => {
		if (relatedData) {
			handleTemplateChange("initial");
		}
	}, [relatedData]);

	const [state, formAction, isSubmitting] = useActionState(sendInvoiceEmail, {
		success: false,
		error: false,
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		startTransition(() => {
			event.preventDefault();
			const formData = new FormData(event.currentTarget);
			formAction(formData);
		});
	};

	useEffect(() => {
		if (state.success) {
			toast(`Invoice email has been sent!`);
			setOpen(false);
		}
	}, [state, setOpen]);

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<input type="hidden" name="invoiceId" value={relatedData?.id} />
			<input type="hidden" name="invoice" value={JSON.stringify(relatedData)} />
			<input
				type="hidden"
				name="clientEmail"
				value={relatedData?.client.email}
			/>
			<div className="space-y-2">
				<Label htmlFor="template">Email Template</Label>
				<Select value={selectedTemplate} onValueChange={handleTemplateChange}>
					<SelectTrigger>
						<SelectValue placeholder="Select template" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="initial">Initial Email</SelectItem>
						<SelectItem value="first-reminder">First Reminder</SelectItem>
						<SelectItem value="second-reminder">Second Reminder</SelectItem>
						<SelectItem value="third-reminder">Third Reminder</SelectItem>
					</SelectContent>
				</Select>
				<input type="hidden" name="template" value={selectedTemplate} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="email" className="text-xs italic text-muted-foreground">
					{relatedData?.client.name} ({relatedData?.client.email})
				</Label>
			</div>
			<div className="space-y-2">
				<Label htmlFor="subject">Subject</Label>
				<Input
					id="subject"
					name="subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="message">Message</Label>
				<Textarea
					id="message"
					name="message"
					rows={4}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
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
			<Button className="bg-accent text-foreground">
				{isSubmitting ? (
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
		</form>
	);
}
