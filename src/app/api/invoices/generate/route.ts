export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest } from "next/server";
import { generatePdfService } from "../../../../../services/invoice/server/generatePdfService";
// Services
export async function POST(req: NextRequest) {
	const result = await generatePdfService(req);
	return result;
}
