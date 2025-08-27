"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Settings, SettingsSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, Bot, MapPin, User, Loader2, SaveIcon } from "lucide-react";
import Company from "./Company";
import Preferences from "./Preferences";
import Invoicing from "./Invoicing";
import BasicInfo from "./BasicInfo";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = {
	name: string;
	value: string;
	component: React.ReactNode;
	icon: React.ElementType;
	fields: string[];
};

export default function SettingsForm() {
	const methods = useForm<Settings>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			companyName: "",
			companyEmail: "",
			companyPhone: "",
			addressLine1: "",
			addressLine2: "",
			city: "",
			state: "",
			country: "",
			currencyCode: "USD",
			dateFormat: "MM/DD/YYYY",
			taxRate: 0,
			invoicePrefix: "INV",
			nextInvoiceNumber: 1,
			logoUrl: "",
		},
	});
	const [loading, setLoading] = useState(false);
	const {
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
		watch,
		control,
	} = methods;

	// Simple function to get error count for a tab
	const getTabErrorCount = (tabValue: string) => {
		return tabs
			.find((tab) => tab.value === tabValue)
			?.fields.filter((field) => errors[field as keyof typeof errors]).length;
	};

	const fetchData = async () => {
		//Set loading to true
		setLoading(true);
		try {
			const response = await fetch("/api/settings", { cache: "no-store" });
			if (response.status === 401) {
				redirect("/login");
			}
			const data: Settings = await response.json();
			if (response.status === 200) {
				const record = data as Record<string, any>;
				setValue("companyName", record.companyName ?? "");
				setValue("companyEmail", record.companyEmail ?? "");
				setValue("companyPhone", record.companyPhone ?? "");
				setValue("addressLine1", record.addressLine1 ?? "");
				setValue("addressLine2", record.addressLine2 ?? "");
				setValue("city", record.city ?? "");
				setValue("state", record.state ?? "");
				setValue("country", record.country ?? "");
				setValue("currencyCode", record.currencyCode ?? "USD");
				setValue("dateFormat", record.dateFormat ?? "MM/DD/YYYY");
				setValue("taxRate", record.taxRate ?? 0);
				setValue("invoicePrefix", record.invoicePrefix ?? "INV");
				setValue("nextInvoiceNumber", record.nextInvoiceNumber ?? 1);
				setValue("logoUrl", record.logoUrl ?? "");
			}
		} catch (error) {
			console.error(error);
		} finally {
			//Set loading to false
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []); // Empty dependency array since fetchData doesn't depend on any props/state

	const onSubmit = handleSubmit(async (data) => {
		try {
			const response = await fetch("/api/settings", {
				method: "POST",
				body: JSON.stringify(data),
				cache: "no-store",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status === 401) {
				redirect("/login");
			}
			if (response.ok) {
				toast.success("Settings updated successfully");
				reset(data);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to update settings");
		}
	});

	const tabs: Tab[] = [
		{
			name: "Basic Info",
			value: "basic-info",
			component: <BasicInfo />,
			icon: InfoIcon,
			fields: ["companyName", "companyEmail", "companyPhone", "logoUrl"],
		},
		{
			name: "Address",
			value: "address",
			component: <Company />,
			icon: MapPin,
			fields: [
				"addressLine1",
				"addressLine2",
				"city",
				"state",
				"postalCode",
				"country",
			],
		},
		{
			name: "Preferences",
			value: "preferences",
			component: <Preferences />,
			icon: User,
			fields: ["currencyCode", "dateFormat", "taxRate"],
		},
		{
			name: "Invoicing",
			value: "invoicing",
			component: <Invoicing />,
			icon: Bot,
			fields: ["invoicePrefix", "nextInvoiceNumber"],
		},
	];

	return (
		<>
			{loading && <Loading />}
			{!loading && (
				<Tabs
					orientation="vertical"
					defaultValue={tabs[0].value}
					className=" w-full flex flex-row items-start gap-4 justify-center h-full">
					<TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background">
						{tabs.map((tab) => {
							const errorCount = getTabErrorCount(tab.value as string);
							const tabHasErrors = errorCount && errorCount > 0;

							return (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className={cn(
										` justify-start text-left rounded-none data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary/5 py-1.5 relative ${
											tabHasErrors
												? "text-destructive "
												: "text-muted-foreground border-transparent"
										}`,
									)}>
									<tab.icon className="h-5 w-5 me-2" />
									<span className="flex-1">{tab.name}</span>
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div
						className="h-full flex flex-col w-full border rounded-md font-medium text-muted-foreground
				bg-[var(--card)]
				">
						{/* Content area */}
						<FormProvider {...methods}>
							<form noValidate className="w-full h-full" onSubmit={onSubmit}>
								<div className="w-full border-b bg-muted/30 px-6 py-4 flex justify-end">
									<Button
										type="submit"
										className="w-auto flex items-center gap-2"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<SaveIcon className="h-4 w-4" />
										)}
										Save Settings
									</Button>
								</div>
								<div className="w-full h-full flex flex-col gap-4 p-6">
									{tabs.map((tab) => (
										<TabsContent
											key={tab.value}
											value={tab.value}
											className=" h-full w-full">
											{tab.component}
										</TabsContent>
									))}
								</div>
							</form>
						</FormProvider>
					</div>
				</Tabs>
			)}
		</>
	);
}
