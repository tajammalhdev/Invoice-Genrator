"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import { InvoiceDetails, InvoiceDetailsSchema } from "@/lib/zodSchemas";
import {
	useClients,
	useCompanySettings,
	discountTypeAtom,
} from "@/hooks/invoice";
import { useAtom } from "jotai";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceBasicInfo from "./InvoiceBasicInfo";
import InvoiceDetailsSection from "./InvoiceDetailsSection";
import ItemList from "./ItemList";
import ItemListItem from "./ItemListItem";
import InvoiceSummary from "./InvoiceSummary";
import AddClientModel from "../_clients/AddClientModel";
import { Invoice, InvoiceItem } from "@prisma/client";
import { toast } from "sonner";
import { useInvoiceContext } from "@/hooks/invoice/InvoiceContext";
import { convertToDateString } from "@/lib/utils";

// Utility function to convert string to date or return today

interface InvoiceFormProps {
	type: "create" | "edit";
	data?: Invoice & {
		items?: InvoiceItem[];
		payments?: any[];
	};
}

export default function InvoiceForm({ type, data }: InvoiceFormProps) {
	const [clients] = useClients();
	const [companySettings] = useCompanySettings();
	const { loading } = useInvoiceContext();
	const [discountType] = useAtom(discountTypeAtom);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		setValue,
		control,
		reset,
	} = useForm<any>({
		resolver: zodResolver(InvoiceDetailsSchema),
		defaultValues: {
			clientId: data?.clientId || "",
			invoiceNumber: data?.number || "",
			issueDate: data?.issueDate
				? convertToDateString(data?.issueDate)
				: new Date().toISOString().split("T")[0],
			dueDate: data?.dueDate
				? convertToDateString(data?.dueDate)
				: new Date().toISOString().split("T")[0],
			notes: data?.notes || "",
			status: data?.status || "DRAFT",
			discount: data?.discount.toString() || "0",
			tax: companySettings?.taxRate?.toString() || "0",
			subtotal: data?.subtotal.toString() || "0",
			total: data?.total.toString() || "0",
			paidTotal: data?.paidTotal.toString() || "0",
			currency: companySettings?.currencyCode || "USD",
			language: "en",
			paymentTerm: data?.paymentTerm || "NET30",
			items: data?.items || [],
			payments: data?.payments || [],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray<any>({
		control,
		name: "items",
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

	const tax = Number(watch("tax")) || Number(companySettings?.taxRate) || 0;
	const discount = Number(watch("discount")) || 0;
	const items_raw = watch("items") || [];

	// Watch individual item totals for real-time subtotal updates
	const itemTotals = items_raw.map((_: any, index: number) =>
		watch(`items.${index}.total`),
	);

	const subtotal = useMemo(() => {
		return itemTotals.reduce((sum: number, total: any) => {
			return sum + (Number(total) || 0);
		}, 0);
	}, [itemTotals]);

	let calculatedDiscountAmount = 0;
	if (discountType === "percentage") {
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

	const handleFormSubmit = async (formData: InvoiceDetails) => {
		try {
			if (type === "create") {
				const response = await fetch("/api/invoices", {
					headers: {
						"Content-Type": "application/json",
					},
					method: "POST",
					body: JSON.stringify(formData),
				});
				const json = await response.json();
				if (response.ok) {
					const successMessage = json.message || "Invoice created successfully";
					toast.success(successMessage);
				} else {
					const errorMessage = json.error || "Failed to create invoice";
					toast.error(errorMessage);
				}
			} else if (type === "edit") {
				const response = await fetch(`/api/invoices/`, {
					headers: {
						"Content-Type": "application/json",
					},
					method: "PUT",
					body: JSON.stringify({ ...formData, invoiceId: data?.id }),
				});
				const json = await response.json();
				console.log(response);
				if (response.ok) {
					const successMessage = json.message || "Invoice updated successfully";
					toast.success(successMessage);
				} else {
					const errorMessage = json.error || "Failed to update invoice";
					toast.error(errorMessage);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleFormError = (errors: any) => {
		console.error("❌ Form validation errors:", errors);
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
				className="">
				<InvoiceHeader isSubmitting={isSubmitting} />
				<div className="w-full px-4 py-6">
					<div className="grid grid-cols-12 gap-4 border-0 rounded-none">
						<InvoiceBasicInfo
							clients={clients as any}
							isLoadingClients={loading.clients}
							register={register}
							errors={errors}
							setCustomValue={setCustomValue}
							onAddClient={() => setIsModalOpen(true)}
							watch={watch}
						/>
						<InvoiceDetailsSection
							register={register}
							setCustomValue={setCustomValue}
							discount={discount}
							errors={errors}
						/>
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
								currency={companySettings?.currencyCode || "USD"}
							/>
						))}
					</ItemList>

					<InvoiceSummary
						subtotal={subtotal}
						tax={calculatedTaxAmount}
						total={total}
						discount={calculatedDiscountAmount}
						currency={watch("currency") || "USD"}
						register={register}
						errors={errors}
						watch={watch}
					/>
				</div>
			</form>
			<AddClientModel
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={() => {
					setIsModalOpen(false);
				}}
			/>
		</>
	);
}
