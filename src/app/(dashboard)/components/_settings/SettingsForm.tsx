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
import { useInvoiceContext } from "@/hooks/invoice/InvoiceContext";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = {
	name: string;
	value: string;
	component: React.ReactNode;
	icon: React.ElementType;
	fields: string[];
};

export default function SettingsForm() {
	const { companySettings, loading: contextLoading } = useInvoiceContext();
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

	// Use companySettings from context to populate form
	useEffect(() => {
		if (companySettings) {
			setValue("companyName", companySettings.companyName ?? "");
			setValue("companyEmail", companySettings.companyEmail ?? "");
			setValue("companyPhone", companySettings.companyPhone ?? "");
			setValue("addressLine1", companySettings.addressLine1 ?? "");
			setValue("addressLine2", companySettings.addressLine2 ?? "");
			setValue("city", companySettings.city ?? "");
			setValue("state", companySettings.state ?? "");
			setValue("country", companySettings.country ?? "");
			setValue("currencyCode", companySettings.currencyCode ?? "USD");
			setValue("dateFormat", companySettings.dateFormat ?? "MM/DD/YYYY");
			setValue("taxRate", companySettings.taxRate ?? 0);
			setValue("invoicePrefix", companySettings.invoicePrefix ?? "INV");
			setValue("nextInvoiceNumber", companySettings.nextInvoiceNumber ?? 1);
			setValue("logoUrl", companySettings.logoUrl ?? "");
		}
	}, [companySettings, setValue]);

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
			{contextLoading.settings && <Loading />}
			{!contextLoading.settings && (
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
								<div className="w-full border-b bg-muted/30 px-6 py-4 flex justify-between items-center">
									<div className="flex items-center gap-2">
										{contextLoading.settings && (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												<span className="text-sm text-muted-foreground">
													Loading settings...
												</span>
											</>
										)}
									</div>
									<Button
										type="submit"
										className="w-auto flex items-center gap-2"
										disabled={isSubmitting || contextLoading.settings}>
										{isSubmitting ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<SaveIcon className="h-4 w-4" />
										)}
										{isSubmitting ? "Saving..." : "Save Settings"}
									</Button>
								</div>
								<div className="w-full h-full flex flex-col gap-4 p-6">
									{contextLoading.settings ? (
										// Skeleton loading for form fields
										<div className="space-y-6">
											{Array.from({ length: 4 }).map((_, index) => (
												<div key={index} className="space-y-3">
													<Skeleton className="h-4 w-24" />
													<Skeleton className="h-10 w-full" />
												</div>
											))}
										</div>
									) : (
										tabs.map((tab) => (
											<TabsContent
												key={tab.value}
												value={tab.value}
												className=" h-full w-full">
												{tab.component}
											</TabsContent>
										))
									)}
								</div>
							</form>
						</FormProvider>
					</div>
				</Tabs>
			)}
		</>
	);
}
