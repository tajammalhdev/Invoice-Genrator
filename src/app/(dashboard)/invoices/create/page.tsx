"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Calendar,
	CalendarIcon,
	Check,
	ChevronsUpDown,
	Save,
	Eye,
	EyeOff,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	Clients,
	InvoiceDetails,
	InvoiceDetailsSchema,
} from "@/lib/zodSchemas";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { CommandEmpty } from "@/components/ui/command";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ItemList from "../../components/_invoices/ItemList";
import ItemListItem from "../../components/_invoices/ItemListItem";
import FormInput from "../../components/_shared/FormInput";

export default function CreateInvoice() {
	const [clients, setClients] = useState<Clients[]>([]);
	const [open, setOpen] = useState(false);
	const [value, setClientValue] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showDiscount, setShowDiscount] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		getValues,
		control,
		reset,
	} = useForm<InvoiceDetails>({
		resolver: zodResolver(InvoiceDetailsSchema),
		defaultValues: {
			invoiceNumber: "",
			issueDate: new Date(),
			dueDate: new Date(),
			notes: "",
			status: "DRAFT",
			discount: 0,
			tax: 0,
			subtotal: 0,
			total: 0,
			paidTotal: 0,
			items: [
				{
					name: "",
					description: "",
					quantity: 0,
					unitPrice: 0,
					total: 0,
				},
			],
		},
		mode: "onChange",
	});

	//items
	const { fields, append, remove } = useFieldArray<InvoiceDetails>({
		control,
		name: "items",
	});

	const items = watch("items");
	useEffect(() => {
		items.forEach((item, index) => {
			const quantity = parseFloat(item.quantity.toString()) || 0;
			const unitPrice = parseFloat(item.unitPrice.toString()) || 0;
			const total = quantity * unitPrice;
			console.log(total);
			setValue(`items.${index}.total`, total);
		});
		const subtotal = items.reduce((acc, item) => acc + item.total, 0);
		setValue("subtotal", subtotal);
	}, [JSON.stringify(items), setValue]);

	const sub_total = watch("subtotal");
	const discount = watch("discount");
	const tax = watch("tax");

	const setCustomValue = (id: string, value: any) => {
		setValue(id as keyof InvoiceDetails, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	//add new item row
	const handleAddNewItemRow = () => {
		append({
			name: "",
			description: "",
			quantity: 0,
			unitPrice: 0,
			total: 0,
		});
	};
	//remove item row
	const handleRemoveItem = (index: number) => {
		remove(index);
	};

	useEffect(() => {
		fetchClients();
	}, []);

	const fetchClients = useCallback(async () => {
		try {
			const response = await fetch("/api/clients", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			if (response.ok) {
				setClients(data.clients);
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	const handleFormSubmit = (data: InvoiceDetails) => {
		console.log(data);
	};

	return (
		<div className="w-full h-full min-h-full px-4 py-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
					<p className="text-muted-foreground">
						Create a new invoice for your client
					</p>
				</div>
			</div>
			<form className="space-y-6 mt-6">
				<Card className="w-full shadow-none">
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="space-y-2">
								<Label htmlFor="clientId">Client</Label>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-[300px] justify-between">
											{value
												? clients.find((client) => client.id === value)?.name
												: "Select Clients..."}
											<ChevronsUpDown className="opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-[300px] p-0">
										<Command>
											<CommandInput
												placeholder="Search Clients..."
												className="h-9"
											/>
											<CommandList>
												<CommandEmpty>No framework found.</CommandEmpty>
												<CommandGroup>
													{clients.map((client) => (
														<CommandItem
															key={client.id}
															value={client.id}
															onSelect={(currentValue) => {
																setClientValue(
																	currentValue === value ? "" : currentValue,
																);
																setOpen(false);
															}}>
															{client.name}
															<Check
																className={cn(
																	"ml-auto",
																	value === client.id
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select name="status" defaultValue="SENT">
									<SelectTrigger className="w-[300px]">
										<SelectValue placeholder="Select a status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="SENT">Sent</SelectItem>
										<SelectItem value="PENDING">Pending</SelectItem>
										<SelectItem value="PAID">Paid</SelectItem>
										<SelectItem value="OVERDUE">Overdue</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="issueDate">Issue Date</Label>
								<Input
									id="issueDate"
									type="date"
									className="w-[300px]"
									{...register("issueDate")}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="dueDate">Due Date</Label>
								<Input
									id="issueDate"
									type="date"
									className="w-[300px]"
									{...register("dueDate")}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								placeholder="Additional notes for the invoice..."
								rows={3}
								name="notes"
								defaultValue="Additional notes for the invoice..."
							/>
						</div>
					</CardContent>
				</Card>

				{/* Invoice Items */}
				<ItemList addItem={handleAddNewItemRow}>
					{fields.map((field, index) => (
						<ItemListItem
							key={field.id}
							id={field.id}
							required={true}
							setCustomValue={() => {}}
							register={register}
							errors={errors}
							watch={watch}
							remove={handleRemoveItem}
							index={index}
						/>
					))}
				</ItemList>
				{/* Summary */}
				<Card className="w-full shadow-none mt-6">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-right">
							<div className="flex justify-between">
								<span>Subtotal:</span>
								<span className="text-right">${sub_total.toFixed(2)}</span>
							</div>
							<div className="flex justify-between items-center">
								<span>Discount:</span>
								<div className="flex items-center gap-2">
									{showDiscount && (
										<FormInput
											name="discount"
											register={register}
											errors={errors}
											placeholder="0"
											className="w-20 text-right"
											min={0}
											step={1}
											max={100}
											required
										/>
									)}

									<span className="text-sm text-muted-foreground">%</span>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setShowDiscount(!showDiscount)}
										className="text-xs">
										{showDiscount ? (
											<EyeOff className="h-3 w-3" />
										) : (
											<Eye className="h-3 w-3" />
										)}
									</Button>
								</div>
							</div>
							<div className="flex justify-between">
								<span>Tax (10%):</span>
								<span>$100</span>
							</div>
							<div className="flex justify-between text-lg font-bold border-t pt-2">
								<span>Total:</span>
								<span>$100</span>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* Actions */}
				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline">
						Cancel
					</Button>
					<Button type="submit" className="flex items-center gap-2">
						<Save className="h-4 w-4" />
						Create Invoice
					</Button>
				</div>
			</form>
		</div>
	);
}
