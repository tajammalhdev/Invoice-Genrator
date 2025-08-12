"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Item, ItemSchema } from "@/app/utils/zodSchemas";

export default function SingleItem() {
	const [items, setItems] = useState<Item[]>([]);
	const addItem = () => {
		setItems([
			...items,
			{
				id: crypto.randomUUID(),
				name: "",
				description: "",
				quantity: 0,
				unitPrice: 0,
				total: 0,
			},
		]);
	};
	const removeItem = (id: string) => {
		setItems(items.filter((item) => item.id !== id));
	};

	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Invoice Items</CardTitle>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addItem}
						className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Add Item
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="grid grid-cols-12 gap-4 items-end border rounded-lg p-4">
						<div className="col-span-3 space-y-2">
							<Label>Item Name</Label>
							<Input placeholder="Item name" name="items[0].name" />
						</div>
						<div className="col-span-3 space-y-2">
							<Label>Item Description</Label>
							<Input
								placeholder="Item description"
								name="items[0].description"
							/>
						</div>
						<div className="col-span-1 space-y-2">
							<Label>Quantity</Label>
							<Input placeholder="Quantity" name="items[0].quantity" />
						</div>
						<div className="col-span-2 space-y-2">
							<Label>Unit Price</Label>
							<Input placeholder="Unit price" name="items[0].unitPrice" />
						</div>
						<div className="col-span-2 space-y-2">
							<Label>Total</Label>
							<Input placeholder="Total" name="items[0].total" />
						</div>
						<div className="col-span-1 space-y-2"></div>
					</div>
					{items.map((item, index) => (
						<div
							key={item.id}
							className="grid grid-cols-12 gap-4 items-end border rounded-lg p-4">
							<div className="col-span-3 space-y-2">
								<Label>Item Name</Label>
								<Input
									placeholder="Item name"
									name={`items[${index + 1}].name`}
									defaultValue={item.name}
								/>
							</div>
							<div className="col-span-3 space-y-2">
								<Label>Item Description</Label>
								<Input
									placeholder="Item description"
									name={`items[${index + 1}].description`}
									defaultValue={item.description}
								/>
							</div>
							<div className="col-span-1 space-y-2">
								<Label>Quantity</Label>
								<Input
									placeholder="Quantity"
									name={`items[${index + 1}].quantity`}
									defaultValue={item.quantity}
								/>
							</div>
							<div className="col-span-2 space-y-2">
								<Label>Unit Price</Label>
								<Input
									placeholder="Unit price"
									name={`items[${index + 1}].unitPrice`}
									defaultValue={item.unitPrice}
								/>
							</div>
							<div className="col-span-2 space-y-2">
								<Label>Total</Label>
								<Input
									placeholder="Total"
									name={`items[${index + 1}].total`}
									defaultValue={item.total}
								/>
							</div>
							<div className="col-span-1 space-y-2">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeItem(item.id)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
