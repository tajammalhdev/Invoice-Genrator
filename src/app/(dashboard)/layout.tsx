import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/_dashboard/AppSideabr";
import { SiteHeader } from "./components/_dashboard/SiteHeader";
import { Suspense } from "react";
import { reqSession } from "../../lib/hooks";
import { InvoiceProvider } from "@/hooks/invoice";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await reqSession();
	return (
		<SidebarProvider>
			<AppSidebar variant="inset" />
			<SidebarInset className="!rounded-none !m-0 !bg-none">
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col  py-2 pt-0">
							<InvoiceProvider>{children}</InvoiceProvider>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
