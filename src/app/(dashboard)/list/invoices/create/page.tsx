import InvoiceForm from "@/app/(dashboard)/components/_invoices/InvoiceForm";
import { reqSession } from "@/lib/hooks";
import prisma from "@/lib/prisma";

export default async function CreateInvoice() {
	const session = await reqSession();

	const data = await prisma.invoice.findMany({
		select: {
			client: true,
		},
	});

	const currencyCode = session?.user.currency;
	console.log(session);
	return <InvoiceForm type="create" data={data} />;
}
