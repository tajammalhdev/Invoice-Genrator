"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Clients, PaymentSchemaValidation } from "@/lib/zodSchemas";
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

export const createClient = async (
	currentState: CurrentState,
	data: Clients,
) => {
	const session = await auth();
	try {
		await prisma.client.create({
			data: {
				...data,
				user: {
					connect: {
						id: session?.user?.id,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const updateClient = async (
	currentState: CurrentState,
	data: Clients,
) => {
	const session = await auth();
	try {
		await prisma.client.update({
			where: {
				id: data.id,
			},
			data: {
				...data,
				user: {
					connect: {
						id: session?.user?.id,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const createPayment = async (
	currentState: CurrentState,
	data: PaymentSchemaValidation,
) => {
	const session = await auth();
	try {
		await prisma.payment.create({
			data: {
				amount: parseFloat(data.amount),
				method: data.method,
				receivedAt: data.receivedAt,
				invoice: {
					connect: {
						id: data.invoiceId,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};

export const updatePayment = async (
	currentState: CurrentState,
	data: PaymentSchemaValidation,
) => {
	const session = await auth();
	try {
		await prisma.payment.update({
			where: {
				id: data.id,
			},
			data: {
				amount: parseFloat(data.amount),
				method: data.method,
				receivedAt: data.receivedAt,
				invoice: {
					connect: {
						id: data.invoiceId,
					},
				},
			},
		});
		return { success: true, error: false };
	} catch (err) {
		return { success: false, error: true };
	}
};
