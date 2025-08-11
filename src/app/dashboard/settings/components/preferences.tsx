"use client";

import {
	Card,
	CardTitle,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	updateInvoiceSettings,
	updatePreferencesSettings,
} from "../../../../../actions/settings";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { PreferencesSchema, type Preferences } from "@/app/utils/zodSchemas";
import SubmitButton from "@/app/components/SubmitButton";
import { useSettings } from "@/app/contexts/SettingsContext";
import { useSettingsForm } from "@/app/hooks/useSettingsForm";

export default function Preferences() {
	const { settings } = useSettings();

	const { formAction, isSubmitting } = useSettingsForm({
		action: updatePreferencesSettings,
		successMessage: "Company information updated successfully!",
	});

	const [form, fields] = useForm<Preferences>({
		onValidate({ formData }) {
			return parseWithValibot(formData, { schema: PreferencesSchema });
		},
		shouldRevalidate: "onInput",
		shouldValidate: "onBlur",
	});

	const [currencyCode, setCurrencyCode] = useState<string>(
		settings?.currencyCode ?? "USD",
	);

	const [dateFormat, setDateFormat] = useState<string>(
		settings?.dateFormat ?? "MM/DD/YYYY",
	);

	const [taxRate, setTaxRate] = useState<number>(settings?.taxRate ?? 0);

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<form
				className="grid grid-cols-1 gap-6"
				id={form.id}
				action={formAction}
				noValidate>
				<Card className="border-none shadow-none">
					<CardHeader>
						<CardTitle>Preferences</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-4">
						<div className="space-y-2">
							<Label>Currency</Label>
							<Select
								value={currencyCode}
								onValueChange={(value) => setCurrencyCode(value)}
								name={fields.currencyCode.name}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USD">USD - US Dollar</SelectItem>
									<SelectItem value="EUR">EUR - Euro</SelectItem>
									<SelectItem value="GBP">GBP - British Pound</SelectItem>
									<SelectItem value="INR">INR - Indian Rupee</SelectItem>
									<SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
									<SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="dateFormat">Date Format</Label>
							<Input
								id="dateFormat"
								placeholder="yyyy-MM-dd"
								value={dateFormat}
								name={fields.dateFormat.name}
								onChange={(e) => setDateFormat(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="taxRate">Default Tax Rate (%)</Label>
							<Input
								id="taxRate"
								type="number"
								step="0.01"
								placeholder="0"
								value={taxRate}
								name={fields.taxRate.name}
								onChange={(e) => setTaxRate(Number(e.target.value))}
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
