import { NextRequest, NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
	try {
		const {
			invoice,
			companySettings,
			clientEmail,
			clientName,
			subject,
			message,
		} = await request.json();

		if (!invoice || !clientEmail) {
			return NextResponse.json(
				{ error: "Missing required fields: invoice and clientEmail" },
				{ status: 400 },
			);
		}
		console.log(
			"================Company Settings=================",
			companySettings,
		);
		const result = await sendInvoiceEmail({
			invoice,
			companySettings,
			clientEmail,
			clientName,
			subject,
			message,
		});

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: "Invoice email sent successfully",
			});
		} else {
			return NextResponse.json(
				{ error: "Failed to send email", details: result.error },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Error in send-email API:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
