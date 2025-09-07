"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Form, useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import {
	InvoiceDetails,
	InvoiceDetailsSchema,
	PaymentTerm,
} from "@/lib/zodSchemas";
import InvoiceHeader from "./InvoiceHeader";
import FormField from "@/app/components/FormField";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SelectDropdown from "@/app/components/SelectDropdown";
import DateInput from "@/app/components/DateInput";
import { convertToDateString } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DiscountField from "@/app/components/DiscountField";
import ItemList from "./ItemList";
import ItemListItem from "./ItemListItem";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceFormProps {
	type: "create" | "edit";
	data?: any;
}

const statusOptions = [
	{ value: "DRAFT", label: "Draft" },
	{ value: "PENDING", label: "Pending" },
	{ value: "PAID", label: "Paid" },
	{ value: "OVERDUE", label: "Overdue" },
];

export default function InvoiceForm({ type, data }: InvoiceFormProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
		setValue,
	} = useForm({
		resolver: zodResolver(InvoiceDetailsSchema),
		defaultValues: {
			...data,
		},
	});
	const setCustomValue = useCallback(
		(id: string, value: any) => {
			setValue(id as keyof InvoiceDetails, value, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		},
		[setValue],
	);
	const { fields, append, remove } = useFieldArray<any>({
		control,
		name: "items",
	});
	const handleAddNewItemRow = () => {
		append({
			name: "",
			description: "",
			quantity: "0",
			unitPrice: "0",
			total: "0",
		});
	};

	const handleRemoveItem = (index: number) => {
		remove(index);
	};

	const today = useMemo(() => convertToDateString(new Date()), []);

	return (
		<form>
			<InvoiceHeader />
			<div className="w-full px-4 py-6">
				<div className="grid grid-cols-12 gap-4 border-0 rounded-none">
					<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max py-7 min-h-[200px]">
						<CardContent className="px-3">
							<Label htmlFor="clientId">Client</Label>
							<SelectDropdown
								options={
									data?.map((item: any) => ({
										id: item.client.id,
										description:
											item.client.company || `Client ID: ${item.client.id}`,
									})) || []
								}
								value={watch("clientId")}
								placeholder="Select a client..."
								onSelect={(clientId) => setValue("clientId", clientId)}
								className="mt-2"
							/>
							{errors.clientId && (
								<p className="text-sm text-red-500 mt-1">
									{errors.clientId?.message as string}
								</p>
							)}
						</CardContent>
					</Card>
					<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max py-2 min-h-[200px]">
						<CardContent className="px-3">
							<FormField
								label="Issue Date"
								error={errors.issueDate?.message as string}>
								<DateInput
									name="issueDate"
									register={register}
									setCustomValue={setCustomValue}
									defaultValue={today}
								/>
							</FormField>
							<FormField
								label="Due Date"
								error={errors.dueDate?.message as string}>
								<DateInput
									name="dueDate"
									register={register}
									setCustomValue={setCustomValue}
									defaultValue={today}
								/>
							</FormField>
							<FormField
								label="Payment Term"
								error={errors.paymentTerm?.message as string}>
								<Select
									defaultValue={PaymentTerm.NET30}
									onValueChange={(value) =>
										setCustomValue("paymentTerm", value)
									}>
									<SelectTrigger className="w-full py-2 px-3 rounded-md text-sm border border-gray-300">
										<SelectValue placeholder="Select a payment term" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(PaymentTerm).map((term) => (
											<SelectItem key={term} value={term}>
												{term}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
						</CardContent>
					</Card>
					<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max py-2 min-h-[200px]">
						<CardContent className="px-3">
							<FormField
								label="Invoice Number"
								error={errors.number?.message as string}>
								<Input {...register("number")} placeholder="Invoice Number" />
							</FormField>
							<FormField
								label="Status"
								error={errors.status?.message as string}>
								<Select
									defaultValue="DRAFT"
									onValueChange={(value) => setCustomValue("status", value)}>
									<SelectTrigger className="w-full py-2 px-3 rounded-md text-sm border border-gray-300">
										<SelectValue placeholder="Select a Status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>
							<DiscountField
								discountType={watch("discountType")}
								discountValue={watch("discountValue")}
								onDiscountTypeChange={(value) =>
									setCustomValue("discountType", value)
								}
								onDiscountValueChange={(value) =>
									setCustomValue("discountValue", value)
								}
								error={errors.discount?.message as string}
							/>
						</CardContent>
					</Card>
				</div>

				<ItemList addItem={handleAddNewItemRow}>
					{fields.map((field, index) => (
						<ItemListItem
							key={field.id}
							control={control}
							id={field.id}
							required={true}
							register={register}
							errors={errors}
							watch={watch}
							remove={handleRemoveItem}
							index={index}
							setCustomValue={setCustomValue}
							currency={"USD"}
						/>
					))}
				</ItemList>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
					<div className="col-span-1">
						<Card className="w-full shadow-none rounded-none py-3 min-h-[275px]">
							<CardHeader className="border-b border-border !pb-3">
								<CardTitle className="text-lg font-bold">Public Note</CardTitle>
							</CardHeader>
							<CardContent>
								<FormField
									label="Invoice Number"
									error={errors.note?.message as string}>
									<Textarea
										placeholder="Enter public note here..."
										className="resize-none"
										rows={10}
										{...register("note")}
									/>
								</FormField>
							</CardContent>
						</Card>
					</div>
					<div className="col-span-1">
						<Card className="w-full shadow-none rounded-none py-3 min-h-[275px]">
							<CardHeader className="border-b border-border !pb-3">
								<CardTitle className="text-lg font-bold">Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-sm font-medium">Subtotal:</span>
										<span className="text-sm text-right"></span>
									</div>

									<div className="flex justify-between">
										<span className="text-sm font-medium">Discount:</span>
										<span className="text-sm text-right"></span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm font-medium">Tax %:</span>
										<span className="text-sm text-right"></span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="border-t border-border pb-3">
								<div className="flex justify-between text-lg font-bold">
									<span>Total:</span>
									<span></span>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</form>
	);
}
