import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@/lib/auth";
export type FormContainerProps = {
	table: "client" | "payment";
	type: "create" | "update" | "delete";
	data?: any;
	id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
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
			if (!id) {
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
				relatedData = {
					invoices: invoices,
				};
			}
			if (id) {
				const payment = await prisma.payment.findUnique({
					where: {
						id: id as string,
					},
				});
				relatedData = payment;
			}
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
			/>
		</div>
	);
};

export default FormContainer;
