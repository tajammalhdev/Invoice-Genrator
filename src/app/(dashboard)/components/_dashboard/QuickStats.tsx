import {
	IconTrendingDown,
	IconTrendingUp,
	IconFileInvoice,
	IconClockHour4,
	IconCheck,
	IconAlertTriangle,
	IconCurrencyDollar,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function QuickStats() {
	const stats = [
		{
			title: "Total Invoices",
			value: "128",
			icon: IconFileInvoice,
			trend: "+8%",
			trendUp: true,
			footerText: "More invoices created this month",
			subText: "Compared to last month",
		},
		{
			title: "Pending",
			value: "14",
			icon: IconClockHour4,
			trend: "-5%",
			trendUp: false,
			footerText: "Pending invoices decreased",
			subText: "Clients responding faster",
		},
		{
			title: "Paid",
			value: "102",
			icon: IconCheck,
			trend: "+12%",
			trendUp: true,
			footerText: "Faster payment cycle",
			subText: "Great collection rate",
		},
		{
			title: "Overdue",
			value: "12",
			icon: IconAlertTriangle,
			trend: "-3%",
			trendUp: false,
			footerText: "Overdue invoices reduced",
			subText: "Follow-ups working well",
		},
	];

	return (
		<div className="*:data-[slot=card]:from-primary/5 mb-5 pt-5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{stats.map((stat, i) => {
				const TrendIcon = stat.trendUp ? IconTrendingUp : IconTrendingDown;
				return (
					<Card key={i} className="@container/card">
						<CardHeader>
							<div className="flex items-center gap-2">
								<stat.icon className="h-4 w-4 text-muted-foreground" />
								<CardDescription>{stat.title}</CardDescription>
							</div>
							<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
								{stat.value}
							</CardTitle>
							<CardAction>
								<Badge variant="outline">
									<TrendIcon className="h-4 w-4" />
									{stat.trend}
								</Badge>
							</CardAction>
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 flex gap-2 font-medium">
								{stat.footerText} <TrendIcon className="size-4" />
							</div>
							<div className="text-muted-foreground">{stat.subText}</div>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}
