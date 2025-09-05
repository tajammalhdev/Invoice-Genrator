import prisma from "@/lib/prisma";
type CurrentState = { success: boolean; error: boolean };

export const deleteClient = async (
	currentState: CurrentState,
	data: FormData,
) => {
	const id = data.get("id") as string;
	try {
		await prisma.client.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};
