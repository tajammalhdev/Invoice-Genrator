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
export function formatDate(dateValue: string | Date): string {
	const date = new Date(dateValue);
	// Adjust for timezone to get local date
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export async function imabebase64(image: File): Promise<string> {
	const reader = new FileReader();
	reader.readAsDataURL(image);

	return new Promise((resolve, reject) => {
		reader.onload = () => resolve(reader.result as string);

		reader.onerror = (error) => reject(error);
	});
}

export const convertToDateString = (
	dateInput: string | Date | null | undefined,
): string => {
	if (!dateInput) {
		return new Date().toISOString().split("T")[0];
	}

	try {
		const date = new Date(dateInput);
		if (isNaN(date.getTime())) {
			return new Date().toISOString().split("T")[0];
		}
		return date.toISOString().split("T")[0];
	} catch (error) {
		return new Date().toISOString().split("T")[0];
	}
};
