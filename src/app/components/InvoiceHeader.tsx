"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	Home,
	ChevronRight,
	FileText,
	Plus,
	Save,
	Loader2,
	ArrowDown,
	ChevronDown,
	Trash2,
	Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useInvoiceActions } from "@/hooks/invoice/InvoiceContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCompanySettings } from "@/hooks/invoice/InvoiceContext";
import { useEmailDialog } from "@/hooks/invoice/InvoiceContext";
import { downloadInvoicePDF } from "@/lib/pdfGenerator";
import SiteHeader from "../(dashboard)/components/_dashboard/SiteHeader";
interface InvoiceActionsProps {
	isSubmitting?: boolean;
	type: "create" | "edit";
}
export default function InvoiceHeader({
	isSubmitting,
	type,
}: InvoiceActionsProps) {
	return (
		<>
			<SiteHeader>
				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" disabled={isSubmitting}>
						<Link href="/list/invoices">Cancel</Link>
					</Button>
					{type === "edit" ? (
						<div
							className="inline-flex items-center rounded-md shadow-sm"
							role="group">
							<Button
								type="submit"
								className="flex items-center gap-2 rounded-r-none h-10"
								disabled={isSubmitting}>
								{isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{isSubmitting ? "Updating..." : "Update"}
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="rounded-l-none h-10 px-3 bg-accent-foreground text-white">
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => {}}
										className=" hover:text-primary hover:bg-accent focus:text-primary focus:bg-accent">
										<Mail className="mr-2 h-4 w-4 text-primary" />
										Email Invoice
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {}}
										className=" hover:text-primary hover:bg-accent focus:text-primary focus:bg-accent">
										<FileText className="mr-2 h-4 w-4 text-primary" />
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
						</div>
					) : (
						<Button
							type="submit"
							className="flex items-center gap-2"
							disabled={isSubmitting}>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							{isSubmitting ? "Saving..." : "Save"}
						</Button>
					)}
				</div>
			</SiteHeader>
		</>
	);
}
