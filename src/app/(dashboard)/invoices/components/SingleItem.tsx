"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import Items from "./Items";

export default function SingleItem() {
	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Invoice Items</CardTitle>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Add Item
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4"></div>
			</CardContent>
		</Card>
	);
}
