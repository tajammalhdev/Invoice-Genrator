import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@/lib/auth";
export type FormContainerProps = {
	table: "client";
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
