import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FormField({
	label,
	children,
	error = "",
	className = "",
}: {
	label: string;
	children: React.ReactNode;
	error?: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"sm:grid sm:gap-10 flex flex-col lg:flex-row px-2 py-4 sm:py-3 lg:items-center sm:grid-cols-3",
				className,
			)}>
			<dt className="text-sm flex flex-col">
				<Label htmlFor={label.toLowerCase().replace(/\s+/g, "")}>{label}</Label>
			</dt>
			<dd className="mt-3 text-sm sm:mt-0 sm:col-span-2">
				{children}
				{error && <p className="text-sm text-red-500 mt-1">{error}</p>}
			</dd>
		</div>
	);
}
