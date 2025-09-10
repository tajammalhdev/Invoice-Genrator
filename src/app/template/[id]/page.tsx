import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import dynamic from "next/dynamic";

type ViewTemplatePageProps = {
	params: Promise<{ id: string }>;
};
const ViewTemplatePage = async (props: ViewTemplatePageProps) => {
	const params = await props.params;
	const templateNumber = params.id;
	const session = await auth();
	const invoices = await prisma.invoice.findUnique({
		where: {
			id: templateNumber,
		},
		include: {
			items: true,
			client: true,
			payments: true,
		},
	});

	const settings = await prisma.setting.findUnique({
		where: {
			userId: session?.user?.id,
		},
	});

	const data = {
		settings,
		invoice: invoices,
	};

	if (!data) return <div>Invoice not found</div>;
	const DynamicComponent = dynamic<any>(
		() =>
			import(
				`@/app/components/templates/invoice-pdf/InvoiceTemplate${settings?.template}`
			),
	);

	return (
		<div className="container">
			<DynamicComponent data={data} />
		</div>
	);
};

export default ViewTemplatePage;
