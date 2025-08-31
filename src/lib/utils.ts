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
