import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, Bot, Home, MapPin, Settings2, User } from "lucide-react";
import Company from "./components/company";
import Preferences from "./components/preferences";
import Invoicing from "./components/invoicing";
import { reqSession } from "@/app/utils/hooks";
import { getSettings } from "../../../../actions/settings";
import BasicInfo from "./components/BasicInfo";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

type Tab = {
	name: string;
	value: string;
	component: React.ReactNode;
	icon: React.ElementType;
};

export default async function Settings() {
	const session = await reqSession();

	const settings = await getSettings(session?.user?.id ?? "");

	const tabs: Tab[] = [
		{
			name: "Basic Info",
			value: "basic-info",
			component: <BasicInfo settings={settings ?? {}} />,
			icon: InfoIcon,
		},
		{
			name: "Address",
			value: "address",
			component: <Company settings={settings ?? {}} />,
			icon: MapPin,
		},
		{
			name: "Preferences",
			value: "preferences",
			component: <Preferences settings={settings ?? {}} />,
			icon: User,
		},
		{
			name: "Invoicing",
			value: "invoicing",
			component: <Invoicing settings={settings ?? {}} />,
			icon: Bot,
		},
	];

	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6">
			<Tabs
				orientation="vertical"
				defaultValue={tabs[0].value}
				className=" w-full flex flex-row items-start gap-4 justify-center h-full">
				<TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background">
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="border-l-2 border-transparent justify-start rounded-none data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary/5 py-1.5">
							<tab.icon className="h-5 w-5 me-2" /> {tab.name}
						</TabsTrigger>
					))}
				</TabsList>
				<div
					className="h-full flex items-center justify-center w-full border rounded-md font-medium text-muted-foreground
				bg-[var(--card)]
				">
					{tabs.map((tab) => (
						<TabsContent
							key={tab.value}
							value={tab.value}
							className="flex items-center justify-center h-full w-full">
							{tab.component}
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
}
