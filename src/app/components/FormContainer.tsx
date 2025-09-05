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
	let relatedData = {};

	switch (table) {
		case "client":
			const clients = await prisma.client.findMany({
				select: { id: true, name: true },
			});
			break;
		default:
			break;
	}
	console.log(table);

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
