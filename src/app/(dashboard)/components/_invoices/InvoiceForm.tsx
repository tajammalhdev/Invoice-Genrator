"use client";

import {
	useState,
	useCallback,
	useMemo,
	useEffect,
	useActionState,
	startTransition,
} from "react";
import { Form, useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import {
	InvoiceDetails,
	InvoiceDetailsSchema,
	InvoiceStatus,
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
import { convertToDateString, formatDate } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DiscountField from "@/app/components/DiscountField";
import ItemList from "../../../components/ItemList";
import ItemListItem from "../../../components/ItemListItem";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice } from "../../../../../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InvoiceFormProps {
	type: "create" | "edit";
	data?: any;
	currency?: any;
	taxRate?: any;
	clients?: any;
}

const statusOptions = [
	{ value: "DRAFT", label: "Draft" },
	{ value: "PENDING", label: "Pending" },
	{ value: "PAID", label: "Paid" },
	{ value: "OVERDUE", label: "Overdue" },
];

export default function InvoiceForm({
	type,
	data,
	currency,
	taxRate,
	clients,
}: InvoiceFormProps) {
	const router = useRouter();
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
			status: InvoiceStatus.DRAFT,
			paymentTerm: PaymentTerm.NET30,
			discountType: "percentage",
			discountValue: "0",
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

	const [state, formAction, isSubmitting] = useActionState(createInvoice, {
		success: false,
		error: false,
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

	const tax = Number(watch("tax")) || Number(taxRate) || 0;
	const discount = Number(watch("discountValue")) || 0;
	const items_raw = watch("items") || [];
	const itemTotals = items_raw.map((_: any, index: number) =>
		watch(`items.${index}.total`),
	);
	const subtotal = useMemo(() => {
		return itemTotals.reduce((sum: number, total: any) => {
			return sum + (Number(total) || 0);
		}, 0);
	}, [itemTotals]);
	let calculatedDiscountAmount = 0;
	if (watch("discountType") === "percentage") {
		calculatedDiscountAmount = (subtotal * discount) / 100;
		if (calculatedDiscountAmount > subtotal) {
			calculatedDiscountAmount = subtotal;
		}
	} else {
		calculatedDiscountAmount = discount;
		if (calculatedDiscountAmount > subtotal) {
			calculatedDiscountAmount = subtotal;
		}
	}

	const taxableAmount = Math.max(subtotal - calculatedDiscountAmount, 0);
	const calculatedTaxAmount = (taxableAmount * tax) / 100;
	const total = taxableAmount + calculatedTaxAmount;
	// Update form values only when calculations change
	useEffect(() => {
		setCustomValue("total", Number(total).toFixed(2));
		setCustomValue("subtotal", Number(subtotal).toFixed(2));
	}, [total, setCustomValue]);

	// Handle redirect after successful creation
	useEffect(() => {
		if (state.success && state.invoiceId) {
			router.push(`/list/invoices/${state.invoiceId}`);
		}
	}, [state.success, state.invoiceId, router]);

	const onSubmit = (data: any) => {
		startTransition(() => {
			console.log(data);
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (key === "items") {
					formData.append(key, JSON.stringify(value));
				} else {
					formData.append(key, String(value));
				}
			});
			formAction(formData);
		});
	};
	const handleFormError = (errors: any) => {
		console.error("❌ Form validation errors:", errors);
	};

	useEffect(() => {
		if (state.success) {
			toast(`Invoice has been created!`);
		}
	}, [state]);

	return (
		<form onSubmit={handleSubmit(onSubmit, handleFormError)}>
			<InvoiceHeader isSubmitting={isSubmitting} type={type} />
			<div className="w-full px-4 py-6">
				<div className="grid grid-cols-12 gap-4 border-0 rounded-none">
					<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max py-7 min-h-[200px]">
						<CardContent className="px-3">
							<Label htmlFor="clientId">Client</Label>
							<SelectDropdown
								options={
									clients?.map((client: any, index: number) => ({
										id: client.id,
										label: client.name,
										description: client.company || client.name,
										key: `${client.id}-${index}`,
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
									defaultValue={
										data?.issueDate ? formatDate(data.issueDate) : today
									}
								/>
							</FormField>
							<FormField
								label="Due Date"
								error={errors.dueDate?.message as string}>
								<DateInput
									name="dueDate"
									register={register}
									setCustomValue={setCustomValue}
									defaultValue={
										data?.dueDate ? formatDate(data.dueDate) : today
									}
								/>
							</FormField>
							<FormField
								label="Payment Term"
								error={errors.paymentTerm?.message as string}>
								<Select
									defaultValue={PaymentTerm.NET30 as string}
									onValueChange={(value) =>
										setCustomValue("paymentTerm", value as string)
									}
									{...register("paymentTerm")}>
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
									defaultValue={InvoiceStatus.DRAFT as string}
									onValueChange={(value) =>
										setCustomValue("status", value as string)
									}
									{...register("status")}>
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
								discountType={watch("discountType") || "percentage"}
								discountValue={watch("discountValue") || "0"}
								onDiscountTypeChange={(value) =>
									setCustomValue("discountType", value)
								}
								onDiscountValueChange={(value) =>
									setCustomValue("discountValue", value)
								}
								error={errors.discount?.message as string}
								currency={currency}
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
									label="Public Note"
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
										<span className="text-sm text-right">
											{currency} {Number(subtotal).toFixed(2)}
										</span>
									</div>

									<div className="flex justify-between">
										<span className="text-sm font-medium">Discount:</span>
										<span className="text-sm text-right">
											{currency} {Number(discount).toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm font-medium">Tax {tax}%:</span>
										<span className="text-sm text-right">
											{currency} {((subtotal * tax) / 100).toFixed(2)}
										</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="border-t border-border pb-3">
								<div className="flex justify-between text-lg font-bold w-full">
									<span>Total:</span>
									<span>
										{currency} {total.toFixed(2)}
									</span>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</form>
	);
}
