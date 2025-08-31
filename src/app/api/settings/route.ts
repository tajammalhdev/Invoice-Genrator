import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
	const session = await auth();
	const userId = (session as any)?.user?.id as string | undefined;

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const settings = await prisma.setting.findUnique({
		where: {
			userId: userId,
		},
	});
	if (!settings) {
		return NextResponse.json({ error: "Settings not found" }, { status: 404 });
	}

	// Ensure all fields are properly returned, including logoUrl
	const responseData = {
		...settings,
		taxRate: settings.taxRate?.toString?.() ?? "0",
		logoUrl: settings.logoUrl || null,
	};

	return NextResponse.json(responseData);
}

export async function POST(request: Request) {
	const session = await auth();
	const userId = (session as any)?.user?.id as string | undefined;

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();

	try {
		// Check if settings exist, if not create them
		let settings = await prisma.setting.findUnique({
			where: { userId: userId },
		});

		if (!settings) {
			// Create new settings with required fields
			const createData = {
				userId: userId,
				companyName: body.companyName || "Your Company",
				companyEmail: body.companyEmail || "billing@yourcompany.com",
				...body,
			};

			settings = await prisma.setting.create({
				data: createData,
			});
		} else {
			// Update existing settings
			settings = await prisma.setting.update({
				where: { userId: userId },
				data: body,
			});
		}

		return NextResponse.json(settings);
	} catch (error) {
		console.error("Error saving settings:", error);
		return NextResponse.json(
			{
				error: "Failed to save settings",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
