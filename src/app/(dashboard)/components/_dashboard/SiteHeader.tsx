"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/app/data/dashboard-nav";
import { Save, X } from "lucide-react";
import { DynamicBreadcrumb } from "../../../components/DynamicBreadcrumb";

interface SiteHeaderProps {
	children?: React.ReactNode;
}

export default function SiteHeader({ children }: SiteHeaderProps) {
	const pathname = usePathname();
	const pageTitle = getPageTitle(pathname);

	return (
		<>
			<header className="sticky top-0 z-10 flex-shrink-0 flex h-18 border-b  bg-accent">
				<div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
					<div className="flex items-center gap-1 lg:gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mx-2 data-[orientation=vertical]:h-4"
						/>
						<h1 className="text-base font-medium">{pageTitle}</h1>
					</div>
					<div className="flex items-center gap-2">{children}</div>
				</div>
			</header>
			<div className="w-full  px-4 pt-6 ">
				<DynamicBreadcrumb />
			</div>
		</>
	);
}
