"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { UseFormRegisterReturn, FieldErrors } from "react-hook-form";
import { InvoiceDetails } from "@/lib/zodSchemas";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PaymentTerm } from "@/lib/zodSchemas";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
}

export default function InvoiceBasicInfo({
	clients,
	isLoadingClients,
	register,
	errors,
	setCustomValue,
	onAddClient,
}: InvoiceBasicInfoProps) {
	const [open, setOpen] = useState(false);
	const [selectedClientId, setSelectedClientId] = useState<string>("");

	// Stable default date values to prevent infinite loops
	const today = useMemo(() => new Date().toISOString().split("T")[0], []);

	// Memoize setCustomValue calls to prevent infinite loops
	const handleClientSelect = useCallback(
		(clientId: string) => {
			setSelectedClientId(clientId);
			setCustomValue("clientId", clientId);
			setOpen(false);
		},
		[setCustomValue],
	);

	const selectedClient = clients.find(
		(client) => client.id === selectedClientId,
	);

	return (
		<>
			{/* Client Selection */}
			<Card className="w-full shadow-none rounded-none col-span-12 xl:col-span-4 h-max">
				<CardContent className="px-5 sm:px-6 py-4 sm:py-3">
					<Label htmlFor="clientId">Client</Label>

					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={open}
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
												onSelect={() => {
													handleClientSelect(client.id);
												}}>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														selectedClientId === client.id
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

							{/* Add Client Option - Outside Command component */}
							<div className="border-t p-2">
								<Button
									variant="ghost"
									onClick={() => {
										setOpen(false);
										onAddClient?.();
									}}
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
					<div className="px-5 sm:px-6 py-4 sm:py-3">
						<div className="flex flex-col gap-2 w-full">
							<Label htmlFor="issueDate">Issue Date</Label>
							<input
								type="date"
								{...register("issueDate")}
								defaultValue={today}
								className="w-full py-2 px-3 rounded-md text-sm disabled:opacity-75 disabled:cursor-not-allowed undefined border border-gray-300"
							/>
						</div>
					</div>

					<div className="px-5 sm:px-6 py-4 sm:py-3">
						<div className="flex flex-col gap-2 w-full">
							<Label htmlFor="dueDate">Due Date</Label>
							<input
								type="date"
								{...register("dueDate")}
								defaultValue={today}
								className="w-full py-2 px-3 rounded-md text-sm disabled:opacity-75 disabled:cursor-not-allowed undefined border border-gray-300"
							/>
						</div>
					</div>

					<div className="sm:grid sm:gap-10 flex flex-col lg:flex-row px-5 sm:px-6 py-4 sm:py-3 lg:items-center sm:grid-cols-3">
						<dt className="text-sm flex flex-col">
							<Label htmlFor="paymentTerm">Payment Term</Label>
						</dt>
						<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
							<Select
								defaultValue={PaymentTerm.NET30}
								{...register("paymentTerm")}
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
						</dd>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
