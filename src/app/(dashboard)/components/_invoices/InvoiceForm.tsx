"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import { InvoiceDetails, InvoiceDetailsSchema } from "@/lib/zodSchemas";
import {
	useClients,
	useCompanySettings,
	useIsLoadingClients,
	discountTypeAtom,
} from "@/hooks/invoice";
import { useAtom } from "jotai";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceBasicInfo from "./InvoiceBasicInfo";
import InvoiceDetailsSection from "./InvoiceDetailsSection";
import ItemList from "./ItemList";
import ItemListItem from "./ItemListItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceActions from "./InvoiceActions";
import AddClientModel from "../_clients/AddClientModel";
import { InvoiceItem } from "@prisma/client";
import { toast } from "sonner";
import { useInvoiceContext } from "@/hooks/invoice/InvoiceContext";
import { convertToDateString } from "@/lib/utils";

// Utility function to convert string to date or return today

export default function InvoiceForm() {
	const [clients] = useClients();
	const [companySettings] = useCompanySettings();
	const { loading, isEditing, invoiceToEdit } = useInvoiceContext();
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
			clientId: "",
			invoiceNumber: "",
			issueDate: new Date().toISOString().split("T")[0],
			dueDate: new Date().toISOString().split("T")[0],
			notes: "",
			status: "DRAFT",
			discount: "0",
			tax: companySettings?.taxRate?.toString() || "0",
			subtotal: "0",
			total: "0",
			paidTotal: "0",
			currency: companySettings?.currencyCode || "USD",
			language: "en",
			paymentTerm: "NET30",
			items: [
				{
					name: "",
					description: "",
					quantity: "0",
					unitPrice: "0",
					total: "0",
				},
			],
			payments: [],
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

	const handleFormSubmit = async (data: InvoiceDetails) => {
		console.log("✅ Form submitted successfully:", {
			data,
			invoiceItems: items_raw,
		});
		try {
			const response = await fetch("/api/invoices", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(data),
			});
			const json = await response.json();
			if (response.ok) {
				const successMessage = json.message || "Invoice created successfully";
				toast.success(successMessage);
			} else {
				const errorMessage = json.error || "Failed to create invoice";
				toast.error(errorMessage);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleFormError = (errors: any) => {
		console.error("❌ Form validation errors:", errors);
	};

	/*============================================Editing Logic============================================*/

	useEffect(() => {
		if (isEditing && invoiceToEdit) {
			const items = (invoiceToEdit as any).items.map((item: InvoiceItem) => {
				return {
					name: item.name,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					total: item.total,
				};
			});
			setValue("items", items);
			setValue("clientId", invoiceToEdit.clientId);
			setValue("invoiceNumber", invoiceToEdit.number);
			setValue("issueDate", convertToDateString(invoiceToEdit.issueDate));
			setValue("dueDate", convertToDateString(invoiceToEdit.dueDate));
			setValue("notes", invoiceToEdit.notes || "");
			setValue("status", invoiceToEdit.status);
			setValue("discount", invoiceToEdit.discount.toString());
			setValue("tax", invoiceToEdit.tax.toString());
			setValue("subtotal", invoiceToEdit.subtotal.toString());
			setValue("total", invoiceToEdit.total.toString());
			setValue("paidTotal", invoiceToEdit.paidTotal.toString());
			setValue("paymentTerm", invoiceToEdit.paymentTerm);
		}
	}, [invoiceToEdit, isEditing]);
	/*============================================Editing Logic============================================*/

	return (
		<>
			<form
				onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
				className="">
				<InvoiceHeader isSubmitting={isSubmitting} />
				<div className="w-full px-4 py-6">
					<div className="grid grid-cols-12 gap-4 border-0 rounded-none">
						<InvoiceBasicInfo
							clients={clients}
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
					// Optionally refresh clients list here
				}}
			/>
		</>
	);
}
