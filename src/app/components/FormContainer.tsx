import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@/lib/auth";
export type FormContainerProps = {
	table: "client" | "payment" | "invoice" | "Email";
	type: "create" | "update" | "delete" | "email" | "pdf";
	data?: any;
	id?: number | string;
	label?: string;
};

const FormContainer = async ({
	table,
	type,
	data,
	id,
	label,
}: FormContainerProps) => {
	let relatedData: any = null;

	switch (table) {
		case "client":
			if (id) {
				const client = await prisma.client.findUnique({
					where: {
						id: id as string,
					},
				});
				relatedData = client;
			}
			break;
		case "payment":
			const invoices = await prisma.invoice.findMany({
				select: {
					number: true,
					payments: {
						select: {
							id: true,
							amount: true,
							method: true,
							receivedAt: true,
						},
					},
				},
			});

			if (id) {
				const payment = await prisma.payment.findUnique({
					where: {
						id: id as string,
					},
				});
				relatedData = {
					...payment,
					invoices: invoices,
				};
			} else {
				relatedData = {
					invoices: invoices,
				};
			}
			break;
		case "Email":
			const invoice = await prisma.invoice.findUnique({
				where: {
					id: id as string,
				},
				include: {
					payments: true,
					items: true,
					client: true,
					user: true,
				},
			});
			relatedData = {
				...invoice,
			};
			break;

		default:
			break;
	}
	return (
		<div className="">
			<FormModal
				table={table}
				type={type}
				data={data}
				id={id}
				relatedData={relatedData}
				label={label}
			/>
		</div>
	);
};

export default FormContainer;
