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
import { Home, ChevronRight, Plus, Search, FileText } from "lucide-react";
import Link from "next/link";
import InvoicePage from "../components/_invoices/InvoicePage";

export default function Invoice() {
	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6 ">
			<Card className="w-full shadow-none rounded-none border-0 bg-accent">
				<CardContent className="px-5 sm:px-6 py-4 sm:py-3">
					<nav className="flex items-center space-x-1 text-sm text-muted-foreground">
						<Link
							href="/dashboard"
							className="flex items-center hover:text-foreground transition-colors">
							<Home className="h-4 w-4 mr-1" />
							Dashboard
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="flex items-center text-foreground">Invoices</span>
					</nav>
				</CardContent>
			</Card>
			{/* Filters and Search */}
			<Card className="mt-5 shadow-none rounded-none">
				<CardContent className="p-4 ">
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
			<InvoicePage />
		</div>
	);
}
