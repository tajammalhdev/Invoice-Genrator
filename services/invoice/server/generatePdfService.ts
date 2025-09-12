import { NextRequest, NextResponse } from "next/server";

// Chromium
import chromium from "@sparticuz/chromium";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Variables
import { ENV, TAILWIND_CDN } from "@/lib/constants";

/**
 * Generate a PDF document of an invoice based on the provided data.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(req: NextRequest) {
	const body: any = await req.json();
	let browser;
	let page;

	try {
		const ReactDOMServer = (await import("react-dom/server")).default;

		const templateId = 1;
		const InvoiceTemplate = await getInvoiceTemplate(templateId);

		if (!InvoiceTemplate) {
			return new NextResponse(
				JSON.stringify({
					error: "Failed to Load HTML Template",
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
			InvoiceTemplate({ data: body }),
		);

		if (!htmlTemplate || htmlTemplate.trim().length < 50) {
			console.error("HTML template is empty or too short:", htmlTemplate);
			return new NextResponse(
				JSON.stringify({
					error: "Failed to Load HTML Template",
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		console.log(
			"HTML template generated successfully, length:",
			htmlTemplate.length,
		);

		if (ENV === "production") {
			console.log("Launching browser in production mode...");
			const puppeteer = (await import("puppeteer-core")).default;
			const executablePath = await chromium.executablePath();
			console.log("Chromium executable path:", executablePath);

			browser = await puppeteer.launch({
				args: [
					...chromium.args,
					"--disable-dev-shm-usage",
					"--ignore-certificate-errors",
					"--disable-gpu",
					"--disable-web-security",
					"--disable-features=VizDisplayCompositor",
				],
				executablePath,
				headless: true,
			});
		} else {
			console.log("Launching browser in development mode...");
			const puppeteer = (await import("puppeteer")).default;
			browser = await puppeteer.launch({
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu",
					"--disable-web-security",
				],
				headless: true,
			});
		}

		if (!browser) {
			throw new Error("Failed to launch browser");
		}
		console.log("Browser launched successfully");

		console.log("Creating new page...");
		page = await browser.newPage();
		console.log("Page created successfully");

		console.log("Setting page content...");
		await page.setContent(htmlTemplate, {
			waitUntil: ["networkidle0", "load", "domcontentloaded"],
			timeout: 30000,
		});
		console.log("Page content set successfully");

		console.log("Adding Tailwind CSS...");
		await page.addStyleTag({
			url: TAILWIND_CDN,
		});
		console.log("Tailwind CSS added successfully");

		console.log("Generating PDF...");
		const pdf: Uint8Array = await page.pdf({
			format: "a4",
			printBackground: true,
			preferCSSPageSize: true,
		});
		console.log("PDF generated successfully, size:", pdf.length);

		return new NextResponse(new Blob([pdf], { type: "application/pdf" }), {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "attachment; filename=invoice.pdf",
				"Cache-Control": "no-cache",
				Pragma: "no-cache",
			},
			status: 200,
		});
	} catch (error: any) {
		console.error("PDF Generation Error:", error);
		return new NextResponse(
			JSON.stringify({
				error: "Failed to generate PDF",
				details: error.message || String(error),
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} finally {
		if (page) {
			try {
				await page.close();
			} catch (e) {
				console.error("Error closing page:", e);
			}
		}
		if (browser) {
			try {
				const pages = await browser.pages();
				await Promise.all(pages.map((p) => p.close()));
				await browser.close();
			} catch (e) {
				console.error("Error closing browser:", e);
			}
		}
	}
}
