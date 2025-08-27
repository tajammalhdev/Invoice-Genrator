"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function InvoiceActions() {
	return (
		<div className="flex justify-end gap-4">
			<Button type="button" variant="outline">
				Cancel
			</Button>
			<Button type="submit" className="flex items-center gap-2">
				<Save className="h-4 w-4" />
				Create Invoice
			</Button>
		</div>
	);
}
