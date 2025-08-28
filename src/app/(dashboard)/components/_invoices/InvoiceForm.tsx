"use client";

import { useState, useCallback } from "react";
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
export default function InvoiceForm() {
	const [clients] = useClients();
	const [companySettings] = useCompanySettings();
	const [isLoadingClients] = useIsLoadingClients();
	const [discountType] = useAtom(discountTypeAtom);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		control,
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

	const tax = watch("tax") || companySettings?.taxRate || 0;
	const discount = watch("discount") || 0;
	const items = watch("items") || [];

	const subtotal = items.reduce((sum: number, item: any) => {
		const itemTotal = Number(item.total) || 0;
		return sum + itemTotal;
	}, 0);

	// Calculate discount amount based on type
	let discountAmount = 0;

	if (discountType === "percentage") {
		// Percentage discount: discount is a percentage of subtotal
		discountAmount = (subtotal * discount) / 100;
		// Cap percentage discount to prevent negative total
		if (discountAmount > subtotal) {
			discountAmount = subtotal;
		}
	} else {
		// Currency discount: discount is a fixed amount
		discountAmount = discount;
		// Cap currency discount to prevent negative total
		if (discountAmount > subtotal) {
			discountAmount = subtotal;
		}
	}

	// Calculate tax amount (on subtotal after discount)
	const taxableAmount = Math.max(subtotal - discountAmount, 0);
	const taxAmount = (taxableAmount * tax) / 100;

	// Calculate final total
	const total = taxableAmount + taxAmount;

	setCustomValue("subtotal", subtotal.toString());
	setCustomValue("discount", discountAmount.toString());
	setCustomValue("tax", tax.toString());
	setCustomValue("total", total.toString());
	setCustomValue("paidTotal", total.toString());

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

	const handleFormSubmit = (data: any) => {
		console.log("✅ Form submitted successfully:", {
			data,
			invoiceItems: items,
		});
	};

	const handleFormError = (errors: any) => {
		console.error("❌ Form validation errors:", errors);
	};

	return (
		<div className="w-full h-full min-h-full px-4 py-6">
			<InvoiceHeader />
			<form
				onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
				className="space-y-6 mt-6">
				<div className="grid grid-cols-12 gap-4 border-0 rounded-none">
					<InvoiceBasicInfo
						clients={clients}
						isLoadingClients={isLoadingClients}
						register={register}
						errors={errors}
						setCustomValue={setCustomValue}
						onAddClient={() => setIsModalOpen(true)}
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
					tax={tax}
					total={total}
					discount={discount}
					currency={watch("currency") || "USD"}
				/>

				<InvoiceActions />
			</form>

			<AddClientModel
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={() => {
					setIsModalOpen(false);
					// Optionally refresh clients list here
				}}
			/>
		</div>
	);
}
