import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import InvoicePage from "../components/_invoices/InvoicePage";
import { SiteHeader } from "../components/_dashboard/SiteHeader";

export default function Invoice() {
	return (
		<>
			<SiteHeader>
				<Button>
					<Plus className="h-4 w-4" />
					New Invoice
				</Button>
			</SiteHeader>

			<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6 ">
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
		</>
	);
}
