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

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();
		const userId = (session as any)?.user?.id as string | undefined;

		const { clientId, ...data } = await request.json();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!clientId) {
			return NextResponse.json(
				{ error: "Client ID is required" },
				{ status: 400 },
			);
		}

		const client = await prisma.client.update({
			where: { id: clientId, userId: userId },
			data,
		});

		return NextResponse.json(client, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

//Get Clients

export async function GET(request: NextRequest) {
	try {
		const session = await auth();
		const userId = (session as any)?.user?.id as string | undefined;

		if (!userId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}
		const { searchParams } = new URL(request.url);
		const page = searchParams.get("page") || "1";
		const clientId = searchParams.get("clientId") || "";

		//limit
		const limit = 10;

		const clients = await prisma.client.findMany({
			where: {
				userId: userId,
				...(clientId && {
					id: {
						contains: clientId,
					},
				}),
			},
			skip: (Number(page) - 1) * limit,
			take: limit,
			orderBy: {
				createdAt: "desc",
			},
		});

		const total = await prisma.client.count({
			where: {
				userId: userId,
				...(clientId && {
					id: {
						contains: clientId,
					},
				}),
			},
		});
		return NextResponse.json({ clients, total });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth();
		const userId = (session as any)?.user?.id as string | undefined;

		const { clientId } = await request.json();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const client = await prisma.client.delete({
			where: {
				id: clientId,
				userId: userId,
			},
		});

		return NextResponse.json(client, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
