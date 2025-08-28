"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtom } from "jotai";
import { discountTypeAtom } from "@/hooks/invoice";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface InvoiceSummaryProps {
	subtotal: number;
	discount: number;
	tax: number;
	total: number;
	currency: string;
	register: any;
	errors: any;
	watch: any;
}

export default function InvoiceSummary({
	subtotal,
	discount,
	tax,
	total,
	currency,
	register,
	errors,
	watch,
}: InvoiceSummaryProps) {
	const [discountType] = useAtom(discountTypeAtom);

	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Public Note Editor */}
				<div className="col-span-1">
					<Card className="w-full shadow-none rounded-none">
						<CardHeader>
							<CardTitle className="text-lg font-bold">Public Note</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea
								placeholder="Enter public note here..."
								className="resize-none"
								rows={10}
								{...register("note")}
							/>
							{errors.note && (
								<p className="text-red-500 text-sm">{errors.note.message}</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Invoice Summary */}
				<div className="col-span-1">
					<Card className="w-full shadow-none rounded-none">
						<CardHeader>
							<CardTitle className="text-lg font-bold">Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-sm font-medium">Subtotal:</span>
									<span className="text-sm text-right">
										{currency} {Number(subtotal).toFixed(2)}
									</span>
								</div>

								{discount > 0 && (
									<div className="flex justify-between">
										<span className="text-sm font-medium">Discount:</span>
										<span className="text-sm text-right">
											{currency} {Number(discount).toFixed(2)}
										</span>
									</div>
								)}

								<div className="flex justify-between">
									<span className="text-sm font-medium">Tax ({tax}%):</span>
									<span className="text-sm text-right">
										{currency} {((subtotal * tax) / 100).toFixed(2)}
									</span>
								</div>

								<div className="flex justify-between text-lg font-bold border-t pt-3">
									<span>Total:</span>
									<span>
										{currency} {total.toFixed(2)}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
