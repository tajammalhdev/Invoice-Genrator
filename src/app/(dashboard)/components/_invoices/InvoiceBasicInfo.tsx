"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
	UseFormRegisterReturn,
	FieldErrors,
	UseFormWatch,
} from "react-hook-form";
import { InvoiceDetails, PaymentTerm } from "@/lib/zodSchemas";
import { useState, useMemo, useCallback, useEffect } from "react";
import { cn, convertToDateString } from "@/lib/utils";

interface Client {
	id: string;
	name: string;
	email: string;
	company?: string;
}

interface InvoiceBasicInfoProps {
	clients: Client[];
	isLoadingClients: boolean;
	register: (name: any) => UseFormRegisterReturn;
	errors: FieldErrors<InvoiceDetails>;
	setCustomValue: (id: string, value: any) => void;
	onAddClient?: () => void;
	watch: UseFormWatch<InvoiceDetails>;
}

// Reusable form field component
const FormField = ({
	label,
	children,
	error,
	className = "",
}: {
	label: string;
	children: React.ReactNode;
	error?: string;
	className?: string;
}) => (
	<div
		className={`sm:grid sm:gap-10 flex flex-col lg:flex-row px-5 sm:px-6 py-4 sm:py-3 lg:items-center sm:grid-cols-3 ${className}`}>
		<dt className="text-sm flex flex-col">
			<Label htmlFor={label.toLowerCase().replace(/\s+/g, "")}>{label}</Label>
		</dt>
		<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
			{children}
			{error && <p className="text-sm text-red-500 mt-1">{error}</p>}
		</dd>
	</div>
);

// Date input component
const DateInput = ({
	name,
	register,
	setCustomValue,
	defaultValue,
	error,
}: {
	name: string;
	register: any;
	setCustomValue: (id: string, value: any) => void;
	defaultValue: string;
	error?: string;
}) => (
	<input
		type="date"
		{...register(name)}
		defaultValue={defaultValue}
		className="w-full py-2 px-3 rounded-md text-sm disabled:opacity-75 disabled:cursor-not-allowed border border-gray-300"
		onChange={(e) => setCustomValue(name, e.target.value)}
	/>
);

export default function InvoiceBasicInfo({
	clients,
	isLoadingClients,
	register,
	errors,
	setCustomValue,
	onAddClient,
	watch,
}: InvoiceBasicInfoProps) {
	const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
	const clientId = watch("clientId");
	const today = useMemo(() => convertToDateString(new Date()), []);

	const selectedClient = useMemo(
		() => clients.find((client) => client.id === clientId),
		[clients, clientId],
	);

	const handleClientSelect = useCallback(
		(selectedClientId: string) => {
			setCustomValue("clientId", selectedClientId);
			setIsClientDropdownOpen(false);
		},
		[setCustomValue],
	);

	const handleAddClient = useCallback(() => {
		setIsClientDropdownOpen(false);
		onAddClient?.();
	}, [onAddClient]);

	return (
		<>
			{/* Client Selection */}
			<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max">
				<CardContent className="px-5 sm:px-6 py-4 sm:py-3">
					<Label htmlFor="clientId">Client</Label>
					<Popover
						open={isClientDropdownOpen}
						onOpenChange={setIsClientDropdownOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={isClientDropdownOpen}
								className="w-full mt-2 justify-between"
								disabled={isLoadingClients}>
								{isLoadingClients ? (
									"Loading clients..."
								) : selectedClient ? (
									<>
										{selectedClient.name}
										{selectedClient.company && ` (${selectedClient.company})`}
									</>
								) : (
									"Select a client..."
								)}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
							<Command>
								<CommandInput placeholder="Search clients..." />
								<CommandList>
									<CommandEmpty>No clients found.</CommandEmpty>
									<CommandGroup>
										{clients.map((client) => (
											<CommandItem
												key={client.id}
												value={`${client.name} ${client.company || ""}`}
												onSelect={() => handleClientSelect(client.id)}>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														clientId === client.id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div className="flex flex-col">
													<span className="font-medium">{client.name}</span>
													{client.company && (
														<span className="text-sm text-muted-foreground">
															{client.company}
														</span>
													)}
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
							<div className="border-t p-2">
								<Button
									variant="ghost"
									onClick={handleAddClient}
									className="w-full justify-start text-black-600 hover:text-blue-700 hover:bg-blue-50">
									<Plus className="mr-2 h-4 w-4" />
									Add New Client
								</Button>
							</div>
						</PopoverContent>
					</Popover>
					{errors.clientId && (
						<p className="text-sm text-red-500 mt-1">
							{errors.clientId.message}
						</p>
					)}
				</CardContent>
			</Card>

			{/* Dates and Payment Terms */}
			<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max">
				<CardContent className="px-0">
					<FormField label="Issue Date" error={errors.issueDate?.message}>
						<DateInput
							name="issueDate"
							register={register}
							setCustomValue={setCustomValue}
							defaultValue={today}
						/>
					</FormField>

					<FormField label="Due Date" error={errors.dueDate?.message}>
						<DateInput
							name="dueDate"
							register={register}
							setCustomValue={setCustomValue}
							defaultValue={today}
						/>
					</FormField>

					<FormField label="Payment Term" error={errors.paymentTerm?.message}>
						<Select
							defaultValue={PaymentTerm.NET30}
							onValueChange={(value) => setCustomValue("paymentTerm", value)}>
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
		</>
	);
}
