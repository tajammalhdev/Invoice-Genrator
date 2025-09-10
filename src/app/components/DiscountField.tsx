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
import { useEffect, useState } from "react";
import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { DiscountType } from "@prisma/client";

interface DiscountFieldProps {
	error?: string;
	disabled?: boolean;
	currency?: string;
	label?: string;
	placeholder?: string;
	className?: string;
	register?: UseFormRegister<any>;
	errors?: FieldErrors<any>;
	setCustomValue?: (name: string, value: any) => void;
	watch?: UseFormWatch<any>;
}

export default function DiscountField({
	error,
	disabled = false,
	currency = "USD",
	label = "Discount Type",
	placeholder = "0",
	className = "",
	register,
	errors,
	setCustomValue,
	watch,
}: DiscountFieldProps) {
	// Watch form values
	const discountTypeValue = watch?.("discountType") || "PERCENTAGE";
	const discountAmount = watch?.("discountAmount") || "0";
	const subtotal = watch?.("subtotal") || "0";

	// Calculate discount based on type
	let calculatedDiscountAmount = 0;
	if (discountTypeValue === DiscountType.PERCENTAGE) {
		calculatedDiscountAmount =
			(Number(subtotal) * Number(discountAmount)) / 100;
		if (calculatedDiscountAmount > Number(subtotal)) {
			calculatedDiscountAmount = Number(subtotal);
		}
	} else {
		calculatedDiscountAmount = Number(discountAmount);
		if (calculatedDiscountAmount > Number(subtotal)) {
			calculatedDiscountAmount = Number(subtotal);
		}
	}

	// Update calculated discount in form
	useEffect(() => {
		setCustomValue?.(
			"discount",
			Number(calculatedDiscountAmount).toFixed(0).toString(),
		);
	}, [calculatedDiscountAmount, setCustomValue]);

	const getMaxValue = () => {
		return discountTypeValue === DiscountType.PERCENTAGE ? 100 : undefined;
	};

	const getStepValue = () => {
		return discountTypeValue === DiscountType.PERCENTAGE ? 1 : 0.01;
	};

	const getSymbol = () => {
		return discountTypeValue === DiscountType.PERCENTAGE ? "%" : currency;
	};

	return (
		<>
			<div
				className={`sm:grid sm:gap-10 flex flex-col lg:flex-row px-2 sm:px-2 py-4 sm:py-3 lg:items-center sm:grid-cols-3 ${className}`}>
				<dt className="text-sm flex flex-col">
					<Label htmlFor="discount">{label}</Label>
				</dt>

				<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
					<div className="flex items-center gap-3 w-full">
						<div className="flex-1">
							<Select
								value={discountTypeValue}
								onValueChange={(value) => {
									setCustomValue?.("discountType", value);
								}}
								disabled={disabled}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select discount type" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(DiscountType).map((type) => (
										<SelectItem key={type} value={type}>
											{type.charAt(0).toUpperCase() +
												type.slice(1).toLowerCase()}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center gap-2 w-32">
							<Input
								placeholder={placeholder}
								className="text-right"
								type="text"
								value={discountAmount}
								onChange={(e) => {
									const value = e.target.value || "0";
									setCustomValue?.("discountAmount", value);
								}}
								disabled={disabled}
								min={0}
								max={getMaxValue()}
								step={getStepValue()}
								{...(register && register("discountAmount"))}
							/>
							<span className="text-sm text-muted-foreground font-medium">
								{getSymbol()}
							</span>
						</div>
					</div>

					{(error || errors?.discountAmount?.message) && (
						<p className="text-sm text-red-500 mt-1">
							{error || (errors?.discountAmount?.message as string)}
						</p>
					)}
				</dd>
			</div>
		</>
	);
}
