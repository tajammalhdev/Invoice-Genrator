"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import SingleItem from "../components/SingleItem";

export default function CreateInvoice() {
	return (
		<div className="w-full h-full min-h-full px-4 py-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
					<p className="text-muted-foreground">
						Create a new invoice for your client
					</p>
				</div>
			</div>
			<form className="space-y-6 mt-6">
				<Card className="w-full shadow-none">
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="clientId">Client</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select a client" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">Client 1</SelectItem>
										<SelectItem value="2">Client 2</SelectItem>
										<SelectItem value="3">Client 3</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<Select name="status" defaultValue="SENT">
									<SelectTrigger>
										<SelectValue placeholder="Select a status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="SENT">Sent</SelectItem>
										<SelectItem value="PENDING">Pending</SelectItem>
										<SelectItem value="PAID">Paid</SelectItem>
										<SelectItem value="OVERDUE">Overdue</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="issueDate">Issue Date</Label>
								<Input id="issueDate" type="date" name="issueDate" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="dueDate">Due Date</Label>
								<Input id="dueDate" type="date" name="dueDate" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								placeholder="Additional notes for the invoice..."
								rows={3}
								name="notes"
								defaultValue="Additional notes for the invoice..."
							/>
						</div>
					</CardContent>
				</Card>
				<SingleItem />

				{/* Summary */}
				<Card className="w-full shadow-none mt-6">
					<CardHeader>
						<CardTitle>Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-right">
							<div className="flex justify-between">
								<span>Subtotal:</span>
								<span>$100</span>
							</div>
							<div className="flex justify-between">
								<span>Tax (10%):</span>
								<span>$100</span>
							</div>
							<div className="flex justify-between text-lg font-bold border-t pt-2">
								<span>Total:</span>
								<span>$100</span>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* Actions */}
				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline">
						Cancel
					</Button>
					<Button type="submit" className="flex items-center gap-2">
						<Save className="h-4 w-4" />
						Create Invoice
					</Button>
				</div>
			</form>
		</div>
	);
}
