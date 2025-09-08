import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Loader2,
	Edit,
	FileText,
	Trash2,
	ChevronDown,
	Mail,
	FilterIcon,
	PlusIcon,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import TableSearch from "./TableSearch";
import { useState } from "react";
import FormContainer from "@/app/components/FormContainer";

export default async function InvoiceList({
	data,
	count,
}: {
	data: Invoice[];
	count: number;
}) {
	// Loading skeleton rows
	const LoadingRows = () => (
		<>
			{Array.from({ length: 5 }).map((_, index) => (
				<TableRow key={`loading-${index}`}>
					<TableCell className="w-[120px]">
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell className="w-[150px]">
						<Skeleton className="h-4 w-24" />
					</TableCell>
					<TableCell className="w-[100px]">
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell className="w-[100px]">
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell className="w-[100px]">
						<Skeleton className="h-4 w-16" />
					</TableCell>
					<TableCell className="w-[100px] text-right">
						<Skeleton className="h-4 w-16 ml-auto" />
					</TableCell>
					<TableCell className="w-[120px] text-right">
						<Skeleton className="h-4 w-16 ml-auto" />
					</TableCell>
					<TableCell className="w-[120px] text-right">
						<Skeleton className="h-4 w-16 ml-auto" />
					</TableCell>
					<TableCell className="w-[120px] text-right">
						<Skeleton className="h-4 w-16 ml-auto" />
					</TableCell>
				</TableRow>
			))}
		</>
	);

	return (
		<>
			<Card className="mt-5 shadow-none rounded-none">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 justify-between">
						<div className="flex items-center gap-2">
							All Invoices
							{false ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								data && (
									<span className="text-sm font-normal text-muted-foreground">
										({data.length})
									</span>
								)
							)}
						</div>
						<div className="flex items-center gap-2">
							<TableSearch />
							<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
								<FilterIcon className="size-4 shrink-0 opacity-50" />
							</button>
							<Button
								className={` flex items-center justify-center rounded-full bg-lamaYellow`}
								variant="outline"
								size="icon"
								asChild>
								<Link href="/list/invoices/create">
									<PlusIcon className="size-4 shrink-0 opacity-50" />
								</Link>
							</Button>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table className="w-full min-w-[800px]">
							<TableHeader>
								<TableRow>
									<TableHead className="w-[120px]">Invoice #</TableHead>
									<TableHead className="w-[150px]">Client</TableHead>
									<TableHead className="w-[100px]">Issue Date</TableHead>
									<TableHead className="w-[100px]">Due Date</TableHead>
									<TableHead className="w-[100px]">Status</TableHead>
									<TableHead className="w-[100px] text-right">Total</TableHead>
									<TableHead className="w-[120px] text-right">Paid</TableHead>
									<TableHead className="w-[120px] text-right">
										Payment Terms
									</TableHead>
									<TableHead className="w-[120px] text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{false ? (
									<LoadingRows />
								) : data && data.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={9}
											className="text-center py-8 text-muted-foreground">
											{!data ? "Loading invoices..." : "No invoices found"}
										</TableCell>
									</TableRow>
								) : (
									data?.map((invoice) => (
										<TableRow key={invoice.id} className="hover:bg-muted/50">
											<TableCell className="font-medium">
												<Link href={`/list/invoices/${invoice.id}`}>
													{invoice.number}
												</Link>
											</TableCell>
											<TableCell>
												{(invoice as any).client?.name ||
													`Client ${invoice.clientId.slice(0, 8)}...`}
											</TableCell>
											<TableCell>
												{typeof invoice.issueDate === "string"
													? new Date(invoice.issueDate).toLocaleDateString()
													: invoice.issueDate.toLocaleDateString()}
											</TableCell>
											<TableCell>
												{typeof invoice.dueDate === "string"
													? new Date(invoice.dueDate).toLocaleDateString()
													: invoice.dueDate.toLocaleDateString()}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														invoice.status === "PAID"
															? "bg-green-100 text-green-800"
															: invoice.status === "PENDING"
															? "bg-yellow-100 text-yellow-800"
															: invoice.status === "OVERDUE"
															? "bg-red-100 text-red-800"
															: "bg-gray-100 text-gray-800"
													}`}>
													{invoice.status}
												</span>
											</TableCell>
											<TableCell className="text-right font-medium">
												${invoice.total?.toFixed(2) || "0.00"}
											</TableCell>
											<TableCell className="text-right">
												${invoice.paidTotal?.toFixed(2) || "0.00"}
											</TableCell>
											<TableCell className="text-right">
												<span className="text-sm text-muted-foreground">
													{invoice.paymentTerm}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center gap-2 justify-end">
													<Button
														variant="outline"
														className="w-8 h-8 flex items-center justify-center rounded-full"
														size="icon"
														asChild>
														<Link href={`/list/invoices/${invoice.id}`}>
															<Edit className=" h-4 w-4 text-muted-foreground" />
														</Link>
													</Button>
													<FormContainer
														table="Email"
														type="email"
														id={invoice.id}
													/>
													<FormContainer
														table="invoice"
														type="delete"
														id={invoice.id}
													/>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
