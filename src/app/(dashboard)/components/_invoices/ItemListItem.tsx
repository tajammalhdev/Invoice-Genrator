import { InvoiceDetails } from "@/lib/zodSchemas";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import FormInput from "../_shared/FormInput";

type ItemListItemProps = {
	id: string;
	required: boolean;
	register: UseFormRegister<InvoiceDetails>;
	errors: FieldErrors<InvoiceDetails>;
	watch: UseFormWatch<InvoiceDetails>;
	setCustomValue: (id: string, value: string) => void;
	remove: (index: number) => void;
	index: number;
};
export default function ItemListItem({
	id,
	required,
	register,
	errors,
	watch,
	remove,
	index,
}: ItemListItemProps) {
	return (
		<span className="block space-y-4">
			<span className="grid grid-cols-12 gap-4 items-end border rounded-lg p-4">
				<span className="col-span-3 space-y-2">
					<FormInput
						name={`items.${index}.name`}
						register={register}
						label="Item Name"
						placeholder="Item Name"
						required
					/>
				</span>
				<span className="col-span-3 space-y-2">
					<FormInput
						name={`items.${index}.description`}
						register={register}
						label="Item Description"
						placeholder="Item Description"
						required
					/>
				</span>
				<span className="col-span-1 space-y-2">
					<FormInput
						name={`items.${index}.quantity`}
						register={register}
						label="Quantity"
						placeholder="Quantity"
						required
					/>
				</span>
				<span className="col-span-2 space-y-2">
					<FormInput
						name={`items.${index}.unitPrice`}
						register={register}
						label="Unit Price"
						placeholder="Unit Price"
						required
					/>
				</span>
				<span className="col-span-2 space-y-2">
					<FormInput
						name={`items.${index}.total`}
						register={register}
						label="Total"
						placeholder="Total"
						required
						disabled={true}
					/>
				</span>
				{index !== 0 && (
					<span className="col-span-1 space-y-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => remove(index)}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</span>
				)}
			</span>
		</span>
	);
}
