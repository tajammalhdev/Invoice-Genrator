"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtom } from "jotai";
import { discountTypeAtom } from "@/hooks/invoice";
import { Editor } from "@tinymce/tinymce-react";

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
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Public Note Editor */}
			<div className="col-span-1">
				<Card className="w-full shadow-none rounded-none">
					<CardHeader>
						<CardTitle className="text-lg font-bold">Public Note</CardTitle>
					</CardHeader>
					<CardContent>
						<Editor
							apiKey="70o81z7j8l2ghbzpjv4qxa532q6wgmircb7omh4yszb3qoh2"
							init={{
								height: 200,
								menubar: false,
								plugins: [
									"advlist",
									"autolink",
									"lists",
									"link",
									"image",
									"charmap",
									"preview",
									"anchor",
									"searchreplace",
									"visualblocks",
									"code",
									"fullscreen",
									"insertdatetime",
									"media",
									"table",
									"code",
									"help",
									"wordcount",
								],
								toolbar:
									"undo redo | blocks | " +
									"bold italic forecolor | alignleft aligncenter " +
									"alignright alignjustify | bullist numlist outdent indent | " +
									"removeformat | help",
								content_style:
									"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
								placeholder: "Enter public note here...",
								statusbar: false,
								resize: false,
							}}
						/>
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
									{currency} {subtotal.toFixed(2)}
								</span>
							</div>

							{discount > 0 && (
								<div className="flex justify-between">
									<span className="text-sm font-medium">Discount:</span>
									<span className="text-sm text-right">
										{discountType === "percentage"
											? `${Number(discount).toFixed(2)}%`
											: `${currency} ${Number(discount).toFixed(2)}`}
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
	);
}
