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
	const json = {
		...settings,
		taxRate: settings.taxRate?.toString?.() ?? "0",
	} as any;

	return NextResponse.json(settings);
}
