"use client";

export default function InvoiceHeader() {
	return (
		<div className="flex items-center gap-4">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
				<p className="text-muted-foreground">
					Create a new invoice for your client
				</p>
			</div>
		</div>
	);
}
