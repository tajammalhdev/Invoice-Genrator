"use client";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface InvoiceActionsProps {
	isSubmitting?: boolean;
}

export default function InvoiceActions({
	isSubmitting = false,
}: InvoiceActionsProps) {
	return (
		<div className="flex justify-end gap-4">
			<Button type="button" variant="outline" disabled={isSubmitting}>
				Cancel
			</Button>
			<Button
				type="submit"
				className="flex items-center gap-2"
				disabled={isSubmitting}>
				{isSubmitting ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Save className="h-4 w-4" />
				)}
				{isSubmitting ? "Creating..." : "Create Invoice"}
			</Button>
		</div>
	);
}
