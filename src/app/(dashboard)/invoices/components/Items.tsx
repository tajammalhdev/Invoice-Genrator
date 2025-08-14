import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	FieldErrors,
	FieldValues,
	useFieldArray,
	useForm,
	UseFormRegister,
	UseFormWatch,
	UseFieldArrayRemove,
} from "react-hook-form";
import { cn } from "@/lib/utils";

export default function Items() {
	return (
		<div className="grid grid-cols-12 gap-4 items-end border rounded-lg p-4">
			<div className="col-span-3 space-y-2">
				<Label>Item Name</Label>
				<Input placeholder="Item name" id={`name`} required={true} />
			</div>
			<div className="col-span-3 space-y-2">
				<Label>Item Description</Label>
				<Input
					placeholder="Item description"
					id={`description`}
					required={true}
				/>
			</div>
			<div className="col-span-1 space-y-2">
				<Label>Quantity</Label>
				<Input placeholder="Quantity" id={`quantity`} required={true} />
			</div>
			<div className="col-span-2 space-y-2">
				<Label>Unit Price</Label>
				<Input placeholder="Unit price" id={`unitPrice`} required={true} />
			</div>
			<div className="col-span-2 space-y-2">
				<Label>Total</Label>
				<Input placeholder="Total" id={`total`} required={true} />
			</div>
			<div className="col-span-1 space-y-2">
				<Button type="button" variant="ghost" size="sm">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
