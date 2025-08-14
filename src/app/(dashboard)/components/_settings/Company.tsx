"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "@/lib/zodSchemas";
import { useFormContext } from "react-hook-form";
import FormInput from "../_shared/FormInput";

export default function Company() {
	const {
		register,
		formState: { errors },
		setValue,
		watch,
		control,
	} = useFormContext<Settings>();

	return (
		<Card className="border-none shadow-none">
			<CardHeader>
				<CardTitle>Company Address</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2 md:col-span-2">
					<FormInput
						label="Address Line 1"
						name="addressLine1"
						register={register}
						errors={errors}
						placeholder="123 Main St"
						type="text"
						required
					/>
				</div>
				<div className="space-y-2 md:col-span-2">
					<FormInput
						label="Address Line 2"
						name="addressLine2"
						register={register}
						errors={errors}
						placeholder="Suite 100"
						type="text"
						required
					/>
				</div>
				<div className="space-y-2">
					<FormInput
						label="City"
						name="city"
						register={register}
						errors={errors}
						placeholder="New York"
						type="text"
						required
					/>
				</div>
				<div className="space-y-2">
					<FormInput
						label="State/Province"
						name="state"
						register={register}
						errors={errors}
						placeholder="NY"
						type="text"
						required
					/>
				</div>
				<div className="space-y-2">
					<FormInput
						label="Postal Code"
						name="postalCode"
						register={register}
						errors={errors}
						placeholder="10001"
						type="text"
						required
					/>
				</div>
				<div className="space-y-2">
					<FormInput
						label="Country"
						name="country"
						register={register}
						errors={errors}
						placeholder="United States"
						type="text"
						required
					/>
				</div>
			</CardContent>
		</Card>
	);
}
