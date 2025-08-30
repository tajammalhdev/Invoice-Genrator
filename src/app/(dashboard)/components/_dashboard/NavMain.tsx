"use client";

import {
	IconCirclePlusFilled,
	IconMail,
	IconDashboard,
	IconInvoice,
	IconUsers,
	IconMoneybag,
	IconReceipt,
	IconSettings,
	type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
		items?: {
			title: string;
			url: string;
			icon?: Icon;
		}[];
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Quick Create"
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
							<IconCirclePlusFilled />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Button
							size="icon"
							className="size-8 group-data-[collapsible=icon]:opacity-0"
							variant="outline">
							<IconMail />
							<span className="sr-only">Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem
							key={item.title}
							className="flex items-center gap-2">
							<SidebarMenuButton tooltip={item.title} asChild>
								<Link href={item.url} className="flex items-center gap-3">
									{item.icon && <item.icon className="h-5 w-5" />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
							{item.items && item.items.length > 0 && (
								<div className="ml-6 mt-2 space-y-1">
									{item.items.map((subItem) => (
										<Link
											key={subItem.title}
											href={subItem.url}
											className="flex items-center justify-center gap-2 p-1 text-white text-sm bg-primary  hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-4 duration-200 ease-linear w-fit">
											{subItem.icon && <subItem.icon className="h-4 w-4" />}
											{subItem.title && <span>{subItem.title}</span>}
										</Link>
									))}
								</div>
							)}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
