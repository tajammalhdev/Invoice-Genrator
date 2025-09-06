"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Assuming these are from shadcn/ui

interface BreadcrumbItem {
	name: string;
	href: string;
	isCurrent: boolean;
}

const formatBreadcrumbName = (name: string): string => {
	// Capitalize the first letter and replace hyphens with spaces
	const formattedName = name.replace(/-/g, " ");
	return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
};

export function DynamicBreadcrumb() {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter(Boolean); // Split and remove empty segments

	if (pathSegments.length === 0) {
		return null; // Don't render a breadcrumb on the homepage
	}

	// Always start with Dashboard as the parent
	const breadcrumbs: BreadcrumbItem[] = [
		{
			name: "Dashboard",
			href: "/dashboard",
			isCurrent: false,
		},
		...pathSegments.map((segment, index) => {
			const isCurrent = index === pathSegments.length - 1;
			const href = "/" + pathSegments.slice(0, index + 1).join("/");
			const name = formatBreadcrumbName(segment);

			return {
				name,
				href,
				isCurrent,
			};
		}),
	];

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((item, index) => (
					<Fragment key={item.href}>
						{index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
						<BreadcrumbItem className="hidden md:block">
							{item.isCurrent ? (
								<BreadcrumbPage>{item.name}</BreadcrumbPage>
							) : (
								<BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
