"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

export default function InvoiceHeader() {
	return (
		<Card className="w-full shadow-none rounded-none border-0 bg-accent">
			<CardContent className="px-5 sm:px-6 py-4 sm:py-3 ">
				<nav className="flex items-center space-x-1 text-sm text-muted-foreground">
					<Link
						href="/dashboard"
						className="flex items-center hover:text-foreground transition-colors">
						<Home className="h-4 w-4 mr-1" />
						Dashboard
					</Link>
					<ChevronRight className="h-4 w-4" />
					<Link
						href="/invoices"
						className="hover:text-foreground transition-colors">
						Invoices
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="flex items-center text-foreground">
						<FileText className="h-4 w-4 mr-1" />
						Create Invoice
					</span>
				</nav>
			</CardContent>
		</Card>
	);
}
