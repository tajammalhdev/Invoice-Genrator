import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif",
	"image/svg+xml",
]);

function getExtensionFromMime(mime: string, fallback: string): string {
	switch (mime) {
		case "image/png":
			return "png";
		case "image/jpeg":
			return "jpg";
		case "image/webp":
			return "webp";
		case "image/gif":
			return "gif";
		case "image/svg+xml":
			return "svg";
		default:
			return fallback;
	}
}

export async function POST(request: Request) {
	const session = await auth();
	const userId = (session as any)?.user?.id as string | undefined;
	if (!userId) return new NextResponse("Unauthorized", { status: 401 });
	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file || !(file instanceof File)) {
		return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
	}
	if (!ALLOWED_MIME.has(file.type)) {
		return NextResponse.json(
			{ error: "Unsupported file type" },
			{ status: 400 },
		);
	}

	const arrayBuffer = await file.arrayBuffer();
	if (arrayBuffer.byteLength > MAX_FILE_BYTES) {
		return NextResponse.json({ error: "File too large" }, { status: 400 });
	}

	const uploadsDir = path.join(process.cwd(), "public", "uploads");
	await fs.mkdir(uploadsDir, { recursive: true });

	const originalName = file.name || "upload";
	const originalExt = path.extname(originalName).replace(".", "") || "bin";
	const safeExt = getExtensionFromMime(file.type, originalExt);
	const fileName = `${userId}-${Date.now()}.${safeExt}`;
	const outPath = path.join(uploadsDir, fileName);

	await fs.writeFile(outPath, Buffer.from(arrayBuffer));

	const publicUrl = `/uploads/${fileName}`;
	return NextResponse.json({ url: publicUrl });
}
