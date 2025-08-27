"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtom } from "jotai";
import { discountTypeAtom } from "@/hooks/invoice";

interface InvoiceSummaryProps {
	subtotal: number;
	discount: number;
	tax: number;
	total: number;
	currency: string;
}

export default function InvoiceSummary({
	subtotal,
	discount,
	tax,
	total,
	currency,
}: InvoiceSummaryProps) {
	const [discountType] = useAtom(discountTypeAtom);
	return (
		<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
			<div className="col-span-1"></div>
			<div className="space-x-2">
				<Card className="w-full shadow-none mt-6 rounded-none">
					<CardHeader>
						<CardTitle className="flex items-center justify-between text-lg font-bold">
							Summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-right">
							<div className="flex justify-between">
								<span className="text-sm font-medium">Subtotal:</span>
								<span className="mt-4 text-sm  text-right">
									{currency} {subtotal.toFixed(2)}
								</span>
							</div>
							{discount > 0 && (
								<div className="flex justify-between">
									<span className="text-sm font-medium">Discount:</span>
									<span className="mt-4 text-sm text-right">
										{discountType === "percentage"
											? `${Number(discount).toFixed(2)}%`
											: `${currency} ${Number(discount).toFixed(2)}`}
									</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="text-sm font-medium">Tax ({tax}%):</span>
								<span className="mt-4 text-sm text-right">
									{tax.toFixed(2)} %
								</span>
							</div>

							<div className="flex justify-between text-lg font-bold border-t pt-2">
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
	);
}
