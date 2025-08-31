"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings } from "@/lib/zodSchemas";
import { useFormContext, Controller } from "react-hook-form";

export default function Preferences() {
	const {
		register,
		formState: { errors },
		control,
	} = useFormContext<Settings>();

	return (
		<Card className="border-none shadow-none">
			<CardHeader>
				<CardTitle>Preferences</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4">
				<div className="space-y-2">
					<Label>Currency</Label>
					<Controller
						name="currencyCode"
						control={control}
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
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
						)}
					/>
					{errors.currencyCode && (
						<p className="text-sm text-destructive">
							{errors.currencyCode.message}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="dateFormat">Date Format</Label>
					<Input
						id="dateFormat"
						placeholder="yyyy-MM-dd"
						{...register("dateFormat")}
					/>
					{errors.dateFormat && (
						<p className="text-sm text-destructive">
							{errors.dateFormat.message}
						</p>
					)}
				</div>
				<div className="space-y-2">
					<Label htmlFor="taxRate">Default Tax Rate (%)</Label>
					<Input
						type="text"
						placeholder="0"
						{...register("taxRate", {
							valueAsNumber: true,
							setValueAs: (value) => {
								if (value === "") return 0;
								return parseInt(value) || 0;
							},
						})}
					/>
					{errors.taxRate && (
						<p className="text-sm text-destructive">{errors.taxRate.message}</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
