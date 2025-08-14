"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Settings, SettingsSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, Bot, MapPin, User } from "lucide-react";
import Company from "./Company";
import Preferences from "./Preferences";
import Invoicing from "./Invoicing";
import BasicInfo from "./BasicInfo";
import SubmitButton from "@/app/components/SubmitButton";
import { useEffect } from "react";
import { redirect } from "next/navigation";

type Tab = {
	name: string;
	value: string;
	component: React.ReactNode;
	icon: React.ElementType;
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

	const {
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
		watch,
		control,
	} = methods;

	const fetchData = async () => {
		//Set loading to true

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
		}
	};

	useEffect(() => {
		fetchData();
	}, []); // Empty dependency array since fetchData doesn't depend on any props/state

	const onSubmit = handleSubmit(async (data) => {
		console.log(data);
	});

	const tabs: Tab[] = [
		{
			name: "Basic Info",
			value: "basic-info",
			component: <BasicInfo />,
			icon: InfoIcon,
		},
		{
			name: "Address",
			value: "address",
			component: <Company />,
			icon: MapPin,
		},
		{
			name: "Preferences",
			value: "preferences",
			component: <Preferences />,
			icon: User,
		},
		{
			name: "Invoicing",
			value: "invoicing",
			component: <Invoicing />,
			icon: Bot,
		},
	];

	return (
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
				className="h-full flex flex-col w-full border rounded-md font-medium text-muted-foreground
				bg-[var(--card)]
				">
				{/* Content area */}
				<FormProvider {...methods}>
					<form noValidate className="w-full h-full" onSubmit={onSubmit}>
						<div className="w-full border-b bg-muted/30 px-6 py-4 flex justify-end">
							<SubmitButton className="w-auto">Save Settings</SubmitButton>
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
	);
}
