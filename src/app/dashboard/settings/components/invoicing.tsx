"use client";
import {
	Card,
	CardContent,
	CardTitle,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInvoiceSettings } from "../../../../../actions/settings";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import {
	InvoiceInformationSchema,
	InvoiceInfoSchema,
} from "@/app/utils/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import SubmitButton from "@/app/components/SubmitButton";

type props = {
	settings: any;
};
export default function Invoicing({ settings }: props) {
	const [state, formAction] = useActionState(updateInvoiceSettings, undefined);

	useEffect(() => {
		if (state && "success" in state && state.success) {
			toast.success("Settings updated successfully!");
			redirect("/dashboard/settings");
		} else if (state && "error" in state && state.error) {
			toast.error(state.error as string);
		}
	}, [state]);

	const [form, fields] = useForm<InvoiceInfoSchema>({
		onValidate({ formData }) {
			return parseWithValibot(formData, { schema: InvoiceInformationSchema });
		},
		shouldRevalidate: "onInput",
		shouldValidate: "onBlur",
	});
	const [invoicePrefix, setInvoicePrefix] = useState<string>(
		settings.invoicePrefix ?? "INV",
	);
	const [nextInvoiceNumber, setNextInvoiceNumber] = useState<number>(
		settings.nextInvoiceNumber ?? 1,
	);

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<form
				className="grid grid-cols-1 gap-6"
				id={form.id}
				action={formAction}
				noValidate
				onSubmit={form.onSubmit}>
				<Card className="border-none shadow-none">
					<CardHeader>
						<CardTitle>Invoicing</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-4">
						<div className="space-y-2">
							<Label htmlFor="invoicePrefix">Invoice Prefix</Label>
							<Input
								id="invoicePrefix"
								placeholder="INV-"
								value={invoicePrefix}
								onChange={(e) => setInvoicePrefix(e.target.value)}
								name={fields.invoicePrefix.name}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
							<Input
								id="nextInvoiceNumber"
								type="number"
								min={1}
								step={1}
								placeholder="1"
								value={nextInvoiceNumber}
								onChange={(e) => setNextInvoiceNumber(Number(e.target.value))}
								name={fields.nextInvoiceNumber.name}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<SubmitButton className="w-auto">Save Settings</SubmitButton>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
