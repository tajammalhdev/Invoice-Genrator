"use client";

import * as React from "react";
import { ChevronDown, LogOut, Plus, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";

const profile = [
	{
		name: "Acme Inc.",
		logo: IconInnerShadowTop,
		plan: "Pro",
	},
];

export function ProfileSwitcher() {
	const { data: session } = useSession();
	const userEmail = session?.user?.email || "Guest";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="w-fit px-1.5">
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
								<IconInnerShadowTop className="size-3" />
							</div>
							<span className="truncate font-medium">Invoice Manager</span>
							<ChevronDown className="opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-64 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Sign in as
						</DropdownMenuLabel>
						<DropdownMenuItem className="gap-2 p-2">
							<div className="text-muted-foreground font-medium">
								{userEmail}
							</div>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-muted-foreground text-xs">
							<User className="size-4" />
							<div className="text-muted-foreground font-medium">
								Account Managements
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => signOut()} className="gap-2 p-2">
							<LogOut className="size-4" />
							<div className="text-muted-foreground font-medium">Logout</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
