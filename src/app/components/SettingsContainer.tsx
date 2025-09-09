"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Settings, SettingsSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import SettingForm from "./SettingForm";

interface SettingsContainerProps {
	settings?: any;
}
export default function SettingsContainer({
	settings,
}: SettingsContainerProps) {
	const methods = useForm<Settings>({
		resolver: zodResolver(SettingsSchema),
	});

	return (
		<>
			<div className="border-border bg-background border-b">
				<div className="container mx-auto flex flex-col px-4 py-4 md:px-6 md:py-6">
					<div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
						<div className="space-y-2">
							<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
								Settings
							</h1>
						</div>
					</div>
				</div>
			</div>
			<div className="container mx-auto px-4 md:px-6 min-h-[calc(100vh-10rem)]">
				<div className="flex flex-col md:flex-row h-full">
					<SettingForm data={settings} />
				</div>
			</div>
		</>
	);
}
