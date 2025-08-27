import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	FieldErrors,
	UseFormRegister,
	Path,
	FieldValues,
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
	label?: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	errors?: FieldErrors<T>;
	placeholder?: string;
	type?: string;
	required?: boolean;
	className?: string;
	step?: number;
	min?: number;
	max?: number;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	autoComplete?: string;
	disabled?: boolean;
};

export default function FormInput<T extends FieldValues>({
	label,
	name,
	register,
	errors,
	placeholder = "",
	type = "text",
	required = false,
	className = "",
	step,
	min,
	max,
	maxLength,
	minLength,
	pattern,
	autoComplete,
	disabled = false,
}: FormInputProps<T>) {
	const hasError = errors && errors[name];

	return (
		<div className={cn("space-y-2", className)}>
			{label && (
				<Label htmlFor={name} className="">
					{label}
					{required && <span className="text-destructive ml-1">*</span>}
				</Label>
			)}

			<Input
				id={name}
				type={type}
				placeholder={placeholder}
				{...register(name)}
				className={cn(
					"w-full mt-3 border border-gray-300 shadow-none",
					hasError && "border-destructive",
				)}
				step={step}
				min={min}
				max={max}
				maxLength={maxLength}
				minLength={minLength}
				pattern={pattern}
				autoComplete={autoComplete}
				disabled={disabled}
			/>

			{hasError && (
				<p className="text-sm text-destructive">
					{errors[name]?.message as string}
				</p>
			)}
		</div>
	);
}
