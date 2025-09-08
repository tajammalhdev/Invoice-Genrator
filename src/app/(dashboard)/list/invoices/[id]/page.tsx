import { use } from "react";
import InvoiceForm from "@/app/(dashboard)/components/_invoices/InvoiceForm";
import prisma from "@/lib/prisma";
import { reqSession } from "@/lib/hooks";

interface InvoicePageProps {
	params: Promise<{ id: string }>;
}
export default async function InvoicePage({ params }: InvoicePageProps) {
	const { id } = await params;
	const session = await reqSession();
	const data = await prisma.invoice.findUnique({
		where: {
			id: id as string,
		},
		include: {
			client: true,
			items: true,
			payments: true,
		},
	});
	const settings = await prisma.setting.findFirst({
		where: {
			userId: session.user.id,
		},
		select: {
			currency: true,
			taxRate: true,
		},
	});

	const clients = await prisma.client.findMany({
		where: {
			userId: session.user.id,
		},
	});
	return (
		<InvoiceForm
			type="edit"
			data={data}
			currency={settings?.currency}
			taxRate={settings?.taxRate}
			clients={clients}
		/>
	);
}
