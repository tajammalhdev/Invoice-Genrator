import InvoiceForm from "@/app/(dashboard)/components/_invoices/InvoiceForm";
import { reqSession } from "@/lib/hooks";
import prisma from "@/lib/prisma";

export default async function CreateInvoice() {
	const session = await reqSession();

	const clients = await prisma.client.findMany({
		where: {
			userId: session.user.id,
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
	return (
		<InvoiceForm
			type="create"
			data={[]}
			clients={clients}
			currency={settings?.currency}
			taxRate={settings?.taxRate}
		/>
	);
}
