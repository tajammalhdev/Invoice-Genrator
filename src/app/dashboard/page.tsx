import { SidebarProvider,SidebarInset } from "@/components/ui/sidebar";
import { reqSession } from "../utils/hooks";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";
import { QuickStats } from "./components/quick-stats";
import { RecentActivityFeed } from "./components/invoice-activity-feeds";
import { RevenueTrendsChart } from "./components/revenue-trends-chart";


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
  )
}