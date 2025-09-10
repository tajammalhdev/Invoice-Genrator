import { InvoiceDetails } from "@/lib/zodSchemas";
import { ReactNode } from "react";

// Types

type InvoiceLayoutProps = {
	data?: any;
	children: ReactNode;
};

export default function InvoiceLayout({ data, children }: InvoiceLayoutProps) {
	// Instead of fetching all signature fonts, get the specific one user selected.

	const head = (
		<>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
				rel="stylesheet"></link>
		</>
	);

	return (
		<>
			{head}
			<section style={{ fontFamily: "Outfit, sans-serif" }}>
				<div className="flex flex-col p-4 sm:p-10 bg-white rounded-xl min-h-[60rem]">
					{children}
				</div>
			</section>
		</>
	);
}
