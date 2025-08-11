"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompanySettings } from "../../../../../actions/settings";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import {
	CompanyInformationSchema,
	CompanyInfoSchema,
} from "@/app/utils/zodSchemas";
import { toast } from "sonner";
import { ImageIcon, UploadCloud } from "lucide-react";
import SubmitButton from "@/app/components/SubmitButton";
import { redirect } from "next/navigation";

type props = {
	settings: any;
};
export default function Company({ settings }: props) {
	const [state, formAction] = useActionState(updateCompanySettings, undefined);

	const [form, fields] = useForm<CompanyInfoSchema>({
		onValidate({ formData }) {
			return parseWithValibot(formData, { schema: CompanyInformationSchema });
		},
	});
	useEffect(() => {
		if (state && "success" in state && state.success) {
			toast.success("Settings updated successfully!");
			redirect("/dashboard/settings");
		} else if (state && "error" in state && state.error) {
			toast.error(state.error as string);
		}
	}, [state]);

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<form
				noValidate
				className="grid grid-cols-1 gap-6"
				id={form.id}
				action={formAction}
				onSubmit={form.onSubmit}>
				<Card className="border-none shadow-none">
					<CardHeader>
						<CardTitle>Company Info</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="addressLine1">Address Line 1</Label>
							<Input
								id={fields.addressLine1.id}
								placeholder="123 Main St"
								name="addressLine1"
								key={fields.addressLine1.key}
								defaultValue={settings.addressLine1}
							/>
							<p className="text-red-500">{fields.addressLine1.errors}</p>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="addressLine2">Address Line 2</Label>
							<Input
								id={fields.addressLine2.id}
								placeholder="Suite 100"
								name="addressLine2"
								key={fields.addressLine2.key}
								defaultValue={settings.addressLine2}
							/>
							<p className="text-red-500">{fields.addressLine2.errors}</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							<Input
								id={fields.city.id}
								placeholder="New York"
								name={fields.city.name}
								key={fields.city.key}
								defaultValue={settings.city}
							/>
							<p className="text-red-500">{fields.city.errors}</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="state">State/Province</Label>
							<Input
								id={fields.state.id}
								placeholder="NY"
								name={fields.state.name}
								key={fields.state.key}
								defaultValue={settings.state}
							/>
							<p className="text-red-500">{fields.state.errors}</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="postalCode">Postal Code</Label>
							<Input
								id={fields.postalCode.id}
								placeholder="10001"
								name={fields.postalCode.name}
								key={fields.postalCode.key}
								defaultValue={settings.postalCode}
							/>
							<p className="text-red-500">{fields.postalCode.errors}</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="country">Country</Label>
							<Input
								id={fields.country.id}
								placeholder="United States"
								name={fields.country.name}
								key={fields.country.key}
								defaultValue={settings.country}
							/>
							<p className="text-red-500">{fields.country.errors}</p>
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
