import {
	IconCamera,
	IconDashboard,
	IconFileAi,
	IconFileDescription,
	IconInnerShadowTop,
	IconReport,
	IconSettings,
	IconUsers,
	IconMoneybag,
	IconReceipt,
	IconInvoice,
} from "@tabler/icons-react";

export const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Invoices",
			url: "/invoices",
			icon: IconInvoice,
		},
		{
			title: "Clients",
			url: "/clients",
			icon: IconUsers,
		},
		{
			title: "Payments",
			url: "#",
			icon: IconMoneybag,
		},
		{
			title: "Estimates",
			url: "#",
			icon: IconReceipt,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: IconCamera,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: IconFileDescription,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	],
	documents: [
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
	],
};
