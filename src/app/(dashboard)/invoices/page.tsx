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
import TableSearch from "../components/_shared/TableSearch";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/utils";

export default async function Invoice({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION

	const query: Prisma.InvoiceWhereInput = {};
	const clientQuery: Prisma.ClientWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "clientId":
						query.clientId = {
							equals: value,
						};
						break;
					case "name":
						clientQuery.name = { contains: value, mode: "insensitive" };
						break;
					case "email":
						clientQuery.email = { contains: value, mode: "insensitive" };
						break;
					case "phone":
						clientQuery.phone = { contains: value, mode: "insensitive" };
						break;
					case "search":
						query.number = { contains: value, mode: "insensitive" };
						break;
					default:
						break;
				}
			}
		}
	}
	// Add client query if any client filters are applied
	if (Object.keys(clientQuery).length > 0) {
		query.client = clientQuery;
	}

	const [data, count] = await prisma.$transaction([
		prisma.invoice.findMany({
			where: query,
			include: {
				client: true,
				items: true,
				payments: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.invoice.count({ where: query }),
	]);

	return (
		<>
			<SiteHeader>
				<Button>
					<Plus className="h-4 w-4" />
					New Invoice
				</Button>
			</SiteHeader>
			<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6 ">
				<InvoicePage data={data} count={count} />
			</div>
		</>
	);
}
