import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function Invoice() {
	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
					<p className="text-muted-foreground">
						Manage your invoices and track payments
					</p>
				</div>
				<Button className="flex items-center gap-2" asChild>
					<Link href="/invoices/create">
						<Plus className="h-4 w-4" />
						Create Invoice
					</Link>
				</Button>
			</div>
			{/* Filters and Search */}
			<Card className="mt-5 shadow-none">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search invoices, clients..."
								className="pl-10"
							/>
						</div>
						<Select>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="DRAFT">Draft</SelectItem>
								<SelectItem value="PENDING">Pending</SelectItem>
								<SelectItem value="PAID">Paid</SelectItem>
								<SelectItem value="OVERDUE">Overdue</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Invoices Table */}
			<Card className="mt-5 shadow-none">
				<CardHeader>
					<CardTitle>All Invoices</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Invoice #</TableHead>
								<TableHead>Client</TableHead>
								<TableHead>Issue Date</TableHead>
								<TableHead>Due Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Paid</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell
									colSpan={8}
									className="text-center py-8 text-muted-foreground">
									No invoices found
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
