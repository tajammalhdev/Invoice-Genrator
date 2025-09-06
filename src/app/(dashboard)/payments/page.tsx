import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "../components/_dashboard/SiteHeader";
import TableSearch from "../components/_shared/TableSearch";
import { Loader2 } from "lucide-react";
import FormContainer from "@/app/components/FormContainer";
import Table from "@/app/components/Table";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/utils";

export default async function PaymentsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;
	const query: Prisma.PaymentWhereInput = {};
	const include: Prisma.PaymentInclude = {
		invoice: true,
	};
	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.invoiceId = { contains: value, mode: "insensitive" };
						break;
					default:
						break;
				}
			}
		}
	}
	const [data, count] = await prisma.$transaction([
		prisma.payment.findMany({
			where: query,
			include: {
				invoice: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.payment.count({ where: query }),
	]);
	const columns = [
		{
			header: "Invoice",
			accessor: "invoice",
		},
		{
			header: "Amount",
			accessor: "amount",
		},
		{
			header: "Method",
			accessor: "method",
		},
		{
			header: "Date",
			accessor: "receivedAt",
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
				<td className="p-2">
					<h3 className="font-semibold">{item.invoice.id}</h3>
				</td>
				<td className="hidden md:table-cell p-2">{item.amount}</td>
				<td className="hidden md:table-cell p-2">{item.method}</td>
				<td className="hidden md:table-cell p-2">
					{item.receivedAt.toLocaleDateString()}
				</td>
				<td className="p-2">
					<div className="flex items-center gap-2">
						<FormContainer table="payment" type="update" id={item.id} />
						<FormContainer table="payment" type="delete" id={item.id} />
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
								All Payments
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
								<FormContainer table="payment" type="create" />
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
