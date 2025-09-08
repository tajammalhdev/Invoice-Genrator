"use client";

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
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Option {
	id: string;
	label: string;
	description?: string;
	key?: string;
}

interface SelectDropdownProps {
	options: Option[];
	value?: string;
	placeholder?: string;
	onSelect: (value: string) => void;
	disabled?: boolean;
	className?: string;
}

export default function SelectDropdown({
	options,
	value,
	placeholder = "Select option...",
	onSelect,
	disabled = false,
	className,
}: SelectDropdownProps) {
	const [open, setOpen] = useState(false);

	const selectedOption = options.find((option) => option.id === value);

	const handleSelect = (selectedValue: string) => {
		onSelect(selectedValue);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={cn(
						"w-full justify-between font-normal",
						!selectedOption && "text-muted-foreground",
						className,
					)}>
					<span className="truncate">
						{selectedOption ? selectedOption.description : placeholder}
					</span>
					<ChevronDown className="ml-2 h-4 w-4 shrink-0" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No options found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.key || option.id}
									value={option.label}
									onSelect={() => handleSelect(option.id)}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === option.id ? "opacity-100" : "opacity-0",
										)}
									/>
									<div className="flex-1">
										<div className="font-medium">{option.label}</div>
										{option.description && (
											<div className="text-sm text-muted-foreground">
												{option.description}
											</div>
										)}
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
