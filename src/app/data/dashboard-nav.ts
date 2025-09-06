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
	IconPlus,
} from "@tabler/icons-react";

// Route configuration type
export interface RouteConfig {
	path: string;
	title: string;
	breadcrumb?: string;
	icon?: any;
	items?: {
		title: string;
		url: string;
		icon?: any;
	}[];
}

// Centralized route configuration
export const routeConfig: Record<string, RouteConfig> = {
	"/": {
		path: "/",
		title: "Dashboard",
		breadcrumb: "Dashboard",
		icon: IconDashboard,
	},
	"/clients": {
		path: "/clients",
		title: "Clients",
		breadcrumb: "Clients",
		icon: IconUsers,
	},
	"/invoices": {
		path: "/invoices",
		title: "Invoices",
		breadcrumb: "Invoices",
		icon: IconInvoice,
	},
	"/invoices/create": {
		path: "/invoices/create",
		title: "Create Invoice",
		breadcrumb: "Invoices / Create",
		icon: IconInvoice,
	},
	"/settings": {
		path: "/settings",
		title: "Settings",
		breadcrumb: "Settings",
		icon: IconSettings,
	},
	"/onboarding": {
		path: "/onboarding",
		title: "Onboarding",
		breadcrumb: "Onboarding",
		icon: IconDashboard,
	},
};

// Utility function to get page title from pathname
export const getPageTitle = (pathname: string): string => {
	// Exact match first
	if (routeConfig[pathname]) {
		return routeConfig[pathname].title;
	}

	// Check for nested routes (like /invoices/create)
	for (const [route, config] of Object.entries(routeConfig)) {
		if (pathname.startsWith(route) && route !== "/") {
			console.log(config.title);
			return config.title;
		}
	}

	// Fallback
	return routeConfig["/"]?.title || "Dashboard";
};

// Utility function to get breadcrumb
export const getBreadcrumb = (pathname: string): string => {
	if (routeConfig[pathname]) {
		return routeConfig[pathname].breadcrumb || routeConfig[pathname].title;
	}

	for (const [route, config] of Object.entries(routeConfig)) {
		if (pathname.startsWith(route) && route !== "/") {
			return config.breadcrumb || config.title;
		}
	}

	return routeConfig["/"]?.breadcrumb || "Dashboard";
};

export const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: IconDashboard,
		},
		{
			title: "Invoices",
			url: "/invoices",
			icon: IconInvoice,
			items: [
				{
					title: "",
					url: "/invoices/create",
					icon: IconPlus,
				},
			],
		},
		{
			title: "Clients",
			url: "/clients",
			icon: IconUsers,
		},
		{
			title: "Payments",
			url: "/payments",
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
