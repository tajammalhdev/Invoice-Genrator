"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "@/lib/zodSchemas";
import { useFormContext } from "react-hook-form";
import FormInput from "../_shared/FormInput";

export default function Invoicing() {
	const {
		register,
		formState: { errors },
	} = useFormContext<Settings>();
	return (
		<Card className="border-none shadow-none">
			<CardHeader>
				<CardTitle>Invoicing</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4">
				<div className="space-y-2">
					<Label htmlFor="invoicePrefix">Invoice Prefix</Label>
					<Input id="invoicePrefix" placeholder="INV-" name="invoicePrefix" />
				</div>
				<div className="space-y-2">
					<FormInput
						label="Next Invoice Number"
						name="nextInvoiceNumber"
						register={register}
						errors={errors}
						placeholder="1"
						type="number"
						min={1}
						step={1}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
