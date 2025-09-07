import { InvoiceDetails } from "@/lib/zodSchemas";
import {
	FieldErrors,
	Control,
	UseFormRegister,
	UseFormWatch,
	useWatch,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import FormInput from "../_shared/FormInput";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

type ItemListItemProps = {
	id: string;
	required: boolean;
	control: Control<InvoiceDetails>;
	register: UseFormRegister<InvoiceDetails>;
	errors: FieldErrors<InvoiceDetails>;
	watch: UseFormWatch<InvoiceDetails>;
	setCustomValue: (id: string, value: any) => void;
	remove: (index: number) => void;
	index: number;
	currency: string;
};
export default function ItemListItem({
	id,
	control,
	required,
	register,
	errors,
	watch,
	remove,
	setCustomValue,
	index,
	currency,
}: ItemListItemProps) {
	const { quantity = 0, unitPrice = 0 } =
		useWatch({ control, name: `items.${index}` }) || {};

	useEffect(() => {
		const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);
		setCustomValue(`items.${index}.total`, Number(total.toFixed(2)));
	}, [quantity, unitPrice, index, setCustomValue]);

	return (
		<TableRow className="border-b border-gray-200 hover:bg-muted dark:bg-none transition-colors duration-150">
			{/* Item Name */}
			<TableCell className="px-4 py-3 w-1/4">
				<FormInput
					name={`items.${index}.name`}
					register={register}
					placeholder="Item Name"
					required
					className="w-full border-0 bg-transparent p-0 text-sm placeholder:text-gray-400 focus:ring-0 focus:border-b-2 focus:border-blue-500 transition-all"
				/>
				{errors.items?.[index]?.name && (
					<p className="text-sm text-red-500 mt-1">
						{errors.items?.[index]?.name.message}
					</p>
				)}
			</TableCell>

			{/* Description */}
			<TableCell className="px-2 lg:px-2.5 xl:px-4 py-2 text-sm w-1/4">
				<Textarea
					{...register(`items.${index}.description`)}
					placeholder="Item Description"
					rows={10}
					className="w-full py-4 px-4 rounded-md text-sm resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-[120px]"
				/>
				{errors.items?.[index]?.description && (
					<p className="text-sm text-red-500 mt-1">
						{errors.items?.[index]?.description.message}
					</p>
				)}
			</TableCell>

			{/* Quantity */}
			<TableCell className="px-4 py-3 text-center">
				<Input
					{...register(`items.${index}.quantity`, {
						required: true,
						valueAsNumber: true,
					})}
					placeholder="0"
					required
					type="text"
				/>
				{errors.items?.[index]?.quantity && (
					<p className="text-sm text-red-500 mt-1">
						{errors.items?.[index]?.quantity.message}
					</p>
				)}
			</TableCell>

			{/* Unit Price */}
			<TableCell className="px-4 py-3 text-right">
				<Input
					{...register(`items.${index}.unitPrice`, {
						required: true,
						valueAsNumber: true,
					})}
					placeholder="0.00"
					required
					type="text"
				/>
				{errors.items?.[index]?.unitPrice && (
					<p className="text-sm text-red-500 mt-1">
						{errors.items?.[index]?.unitPrice.message}
					</p>
				)}
			</TableCell>

			{/* Total */}
			<TableCell className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
				{currency} {Number(watch(`items.${index}.total`)).toFixed(2)}
			</TableCell>

			{/* Actions */}
			<TableCell className="px-4 py-3 text-center w-10">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => remove(index)}
					className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all cursor-pointer dark:hover:bg-red-500 dark:hover:text-white">
					<Trash2 className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
}
