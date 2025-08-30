"use client";

import { useState } from "react";
import {
	useInvoices,
	useLoading,
	useCompanySettings,
} from "@/hooks/invoice/InvoiceContext";
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
	MoreHorizontal,
	Edit,
	FileText,
	Trash2,
	ArrowDown,
	ChevronDown,
	Mail,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadInvoicePDF } from "@/lib/pdfGenerator";
import SendInvoiceEmailDialog from "./SendInvoiceEmailDialog";

export default function InvoicePage() {
	const [invoices] = useInvoices();
	const [loading] = useLoading();
	const [companySettings] = useCompanySettings();
	const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

	const handleDownloadPDF = (invoice: any) => {
		downloadInvoicePDF(invoice, companySettings);
	};

	const handleSendEmail = (invoice: any) => {
		setSelectedInvoice(invoice);
		setIsEmailDialogOpen(true);
	};

	// Loading skeleton rows
	const LoadingRows = () => (
		<>
			{Array.from({ length: 5 }).map((_, index) => (
				<TableRow key={`loading-${index}`}>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-24" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-16" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-16" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-16" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-16" />
					</TableCell>
				</TableRow>
			))}
		</>
	);

	return (
		<>
			<Card className="mt-5 shadow-none rounded-none">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						All Invoices
						{loading.invoices ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							invoices && (
								<span className="text-sm font-normal text-muted-foreground">
									({invoices.length})
								</span>
							)
						)}
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
									<TableHead className="w-[100px] text-right">Paid</TableHead>
									<TableHead className="w-[120px] text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading.invoices ? (
									<LoadingRows />
								) : invoices && invoices.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={8}
											className="text-center py-8 text-muted-foreground">
											{!invoices ? "Loading invoices..." : "No invoices found"}
										</TableCell>
									</TableRow>
								) : (
									invoices?.map((invoice) => (
										<TableRow key={invoice.id} className="hover:bg-muted/50">
											<TableCell className="font-medium">
												{invoice.number}
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
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="outline"
															size="sm"
															className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
															Action
															<ChevronDown className="h-4 w-4 ml-2" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => alert("Edit")}
															className=" hover:text-blue-700 hover:bg-blue-50 focus:text-blue-700 focus:bg-blue-50">
															<Edit className="mr-2 h-4 w-4 text-blue-600" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleSendEmail(invoice)}
															className=" hover:text-blue-700 hover:bg-blue-50 focus:text-blue-700 focus:bg-blue-50">
															<Mail className="mr-2 h-4 w-4 text-blue-600" />
															Email Invoice
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDownloadPDF(invoice)}
															className=" hover:text-blue-700 hover:bg-blue-50 focus:text-blue-700 focus:bg-blue-50">
															<FileText className="mr-2 h-4 w-4 text-blue-600" />
															Download PDF
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => alert("Delete")}
															className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50">
															<Trash2 className="mr-2 h-4 w-4 text-red-600" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Email Dialog */}
			<SendInvoiceEmailDialog
				isOpen={isEmailDialogOpen}
				onClose={() => setIsEmailDialogOpen(false)}
				invoice={selectedInvoice}
				companySettings={companySettings}
				clientEmail={(selectedInvoice as any)?.client?.email}
				clientName={(selectedInvoice as any)?.client?.name}
			/>
		</>
	);
}
