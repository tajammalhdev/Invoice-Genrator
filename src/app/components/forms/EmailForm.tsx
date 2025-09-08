import { Dispatch, SetStateAction } from "react";
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

export default function EmailForm({
	type,
	data,
	setOpen,
	relatedData,
}: FormProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="template">Email Template</Label>
				<Select>
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
			</div>

			<div className="space-y-2">
				<Label htmlFor="subject">Subject</Label>
				<Input id="subject" />
			</div>

			<div className="space-y-2">
				<Label htmlFor="message">Message</Label>
				<Textarea id="message" rows={4} />
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
				<Mail className="mr-2 h-4 w-4" />
				Send Email
			</Button>
		</div>
	);
}
