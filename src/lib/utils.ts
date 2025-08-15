import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
	toast.success("Copied to clipboard!");
};
export const formatDate = (dateString: string | Date) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
