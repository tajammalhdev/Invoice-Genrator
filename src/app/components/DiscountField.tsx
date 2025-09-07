"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type DiscountType = "percentage" | "currency";

interface DiscountFieldProps {
	discountType: DiscountType;
	discountValue: string;
	onDiscountTypeChange: (type: DiscountType) => void;
	onDiscountValueChange: (value: string) => void;
	error?: string;
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	className?: string;
}

export default function DiscountField({
	discountType,
	discountValue,
	onDiscountTypeChange,
	onDiscountValueChange,
	error,
	disabled = false,
	label = "Discount Type",
	placeholder = "0",
	className = "",
}: DiscountFieldProps) {
	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value || "0";
		onDiscountValueChange(value);
	};

	const getMaxValue = () => {
		return discountType === "percentage" ? 100 : undefined;
	};

	const getStepValue = () => {
		return discountType === "percentage" ? 1 : 0.01;
	};

	const getSymbol = () => {
		return discountType === "percentage" ? "%" : "$";
	};

	return (
		<div
			className={`sm:grid sm:gap-10 flex flex-col lg:flex-row px-2 sm:px-2 py-4 sm:py-3 lg:items-center sm:grid-cols-3 ${className}`}>
			<dt className="text-sm flex flex-col">
				<Label htmlFor="discount">{label}</Label>
			</dt>

			<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
				<div className="flex items-center gap-3 w-full">
					<div className="flex-1">
						<Select
							value={discountType}
							onValueChange={onDiscountTypeChange}
							disabled={disabled}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select discount type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="percentage">Percentage (%)</SelectItem>
								<SelectItem value="currency">Fixed Amount</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2 w-32">
						<Input
							id="discount"
							placeholder={placeholder}
							className="text-right"
							type="number"
							value={discountValue}
							onChange={handleValueChange}
							disabled={disabled}
							min={0}
							max={getMaxValue()}
							step={getStepValue()}
						/>
						<span className="text-sm text-muted-foreground font-medium">
							{getSymbol()}
						</span>
					</div>
				</div>

				{error && <p className="text-sm text-red-500 mt-1">{error}</p>}
			</dd>
		</div>
	);
}
