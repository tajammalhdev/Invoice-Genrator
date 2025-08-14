import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { reqSession } from "@/lib/hooks";
import { Suspense } from "react";
import { QuickStats } from "../components/_dashboard/QuickStats";
import { RecentActivityFeed } from "../components/_dashboard/InvoiceActivityFeeds";
import { RevenueTrendsChart } from "../components/_dashboard/RevenueTrendsChart";

export default async function Dashboard() {
	const session = await reqSession();

	return (
		<>
			<QuickStats />
			<div className="px-4 lg:px-6">
				<RecentActivityFeed />
			</div>
			<div className="px-4 lg:px-6">
				<RevenueTrendsChart />
			</div>
		</>
	);
}
