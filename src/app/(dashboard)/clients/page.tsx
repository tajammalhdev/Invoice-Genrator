import prisma from "@/lib/prisma";
import ClientList from "../components/_clients/ClientList";
import { Prisma } from "@prisma/client";
import { copyToClipboard, ITEM_PER_PAGE } from "@/lib/utils";
import { SiteHeader } from "../components/_dashboard/SiteHeader";
import { Button } from "@/components/ui/button";
import {
	Eye,
	Copy,
	Edit,
	Plus,
	Trash2,
	Loader2,
	FilterIcon,
	PlusIcon,
	Link,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TableSearch from "../components/_shared/TableSearch";
import FormContainer from "@/app/components/FormContainer";
import { redirect } from "next/navigation";
import Table from "@/app/components/Table";

export default async function Clients({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION

	const query: Prisma.ClientWhereInput = {};
	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "clientId":
						query.id = {
							equals: value,
						};
						break;
					case "email":
						query.email = { contains: value, mode: "insensitive" };
						break;
					case "phone":
						query.phone = { contains: value, mode: "insensitive" };
						break;
					case "search":
						query.name = { contains: value, mode: "insensitive" };
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.client.findMany({
			where: query,
			include: {
				invoices: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.client.count({ where: query }),
	]);

	const columns = [
		{
			header: "Name",
			accessor: "name",
		},
		{
			header: "Company",
			accessor: "company",
		},
		{
			header: "City",
			accessor: "city",
		},
		{
			header: "Country",
			accessor: "country",
		},
		{
			header: "Total Invoices",
			accessor: "invoices.length",
		},
		{
			header: "Actions",
			accessor: "actions",
		},
	];

	const renderRow = (item: (typeof data)[0]) => {
		return (
			<tr
				key={item.id}
				className="border-b border-gray-200/50 even:bg-primary-50 text-sm hover:bg-lamaPurpleLight">
				<td className="flex items-center gap-2 p-2">
					<div className="flex flex-col">
						<h3 className="font-semibold">{item.name}</h3>
						<p className="text-xs text-muted-foreground">{item?.email}</p>
					</div>
				</td>
				<td className="hidden md:table-cell">{item.company}</td>
				<td className="hidden md:table-cell">{item.city}</td>
				<td className="hidden md:table-cell">{item.phone}</td>
				<td className="hidden md:table-cell">{item.address}</td>
				<td>
					<div className="flex items-center gap-2">
						<Link href={`/clients/${item.id}`}>
							<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
								<Eye className="size-4 shrink-0 opacity-50" />
							</button>
						</Link>
						<FormContainer table="client" type="delete" id={item.id} />
					</div>
				</td>
			</tr>
		);
	};

	return (
		<>
			<SiteHeader />

			<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6 ">
				<Card className="mt-5 shadow-none rounded-none">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 justify-between">
							<div className="flex items-center gap-2">
								All Clients
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
								<FormContainer table="client" type="create" />
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<Table
								columns={columns}
								data={data || []}
								renderRow={renderRow}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
