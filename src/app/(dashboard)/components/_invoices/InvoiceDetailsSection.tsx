"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UseFormRegisterReturn } from "react-hook-form";
import { useAtom } from "jotai";
import { discountTypeAtom } from "@/hooks/invoice";

interface InvoiceDetailsSectionProps {
	register: (name: any) => UseFormRegisterReturn;
	setCustomValue: (id: string, value: any) => void;
	discount: number;
}

const statusOptions = [
	{ value: "DRAFT", label: "Draft" },
	{ value: "PENDING", label: "Pending" },
	{ value: "PAID", label: "Paid" },
	{ value: "OVERDUE", label: "Overdue" },
];

export default function InvoiceDetailsSection({
	register,
	setCustomValue,
	discount,
}: InvoiceDetailsSectionProps) {
	const [discountType, setDiscountType] = useAtom(discountTypeAtom);

	return (
		<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max">
			<CardContent className="px-0">
				<div className="sm:grid sm:gap-10 flex flex-col lg:flex-row px-5 sm:px-6 py-4 sm:py-3 lg:items-center sm:grid-cols-3">
					<dt className="text-sm flex flex-col">
						<Label htmlFor="invoiceNumber">Invoice Number</Label>
					</dt>
					<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
						<Input
							placeholder="Invoice Number"
							{...register("invoiceNumber")}
							className="w-full"
						/>
					</dd>
				</div>

				<div className="sm:grid sm:gap-10 flex flex-col lg:flex-row px-5 sm:px-6 py-4 sm:py-3 lg:items-center sm:grid-cols-3">
					<dt className="text-sm flex flex-col">
						<Label htmlFor="status">Status</Label>
					</dt>
					<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
						<Select
							onValueChange={(value) => setCustomValue("status", value)}
							defaultValue="DRAFT">
							<SelectTrigger className="w-full mb-0 mt-3">
								<SelectValue placeholder="Select a status" />
							</SelectTrigger>
							<SelectContent>
								{statusOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</dd>
				</div>

				<div className="sm:grid sm:gap-10 flex flex-col lg:flex-row px-5 sm:px-6 py-4 sm:py-3 lg:items-center sm:grid-cols-3">
					<dt className="text-sm flex flex-col">
						<Label htmlFor="discount">Discount Type</Label>
					</dt>
					<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
						<div className="flex items-center gap-3 w-full">
							<div className="flex-1">
								<Select
									value={discountType}
									onValueChange={(value) => {
										setDiscountType(value);
									}}>
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
									placeholder="0"
									className="text-right"
									type="number"
									{...register("discount")}
									onChange={(e) =>
										setCustomValue("discount", parseFloat(e.target.value) || 0)
									}
									min={0}
									max={discountType === "percentage" ? 100 : undefined}
									step={discountType === "percentage" ? 1 : 0.01}
								/>
								<span className="text-sm text-muted-foreground font-medium">
									{discountType === "percentage" ? "%" : "$"}
								</span>
							</div>
						</div>
					</dd>
				</div>
			</CardContent>
		</Card>
	);
}
