import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		const userId = (session as any)?.user?.id as string | undefined;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const {
			name,
			email,
			company,
			phone,
			address,
			city,
			state,
			postalCode,
			country,
		} = await request.json();

		const client = await prisma.client.create({
			data: {
				name,
				email,
				company,
				phone,
				address,
				city,
				state,
				postalCode,
				country,
				userId: userId,
			},
		});

		return NextResponse.json(client, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		const userId = (session as any)?.user?.id as string | undefined;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const clients = await prisma.client.findMany({
			where: {
				userId: userId,
			},
		});

		return NextResponse.json(clients);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
