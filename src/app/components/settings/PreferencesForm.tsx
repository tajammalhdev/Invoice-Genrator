import {
	Card,
	CardTitle,
	CardContent,
	CardDescription,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { FormProps } from "../SettingForm";
import FormField from "../FormField";
import { useForm, useFormContext } from "react-hook-form";
import { Setting } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, SaveIcon } from "lucide-react";
import { startTransition, useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { updatePreferences } from "../../../../actions/actions";

export default function PreferencesForm({ data }: FormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Setting>({
		defaultValues: {
			id: data?.id || "",
			dateFormat: data?.dateFormat || "yyyy-MM-dd",
			taxRate: data?.taxRate || 0,
			invoicePrefix: data?.invoicePrefix || "INV-",
		},
	});

	const [state, formAction, isSubmitting] = useActionState(updatePreferences, {
		success: false,
		error: false,
	});
	useEffect(() => {
		if (state.success) {
			toast.success("Preferences updated successfully");
		}
	}, [state.success]);
	useEffect(() => {
		if (state.error) {
			toast.error("Failed to update preferences");
		}
	}, [state.error]);

	const onSubmit = (formData: any) => {
		if (!data?.id) {
			toast.error(
				"Company settings not found. Please create company settings first.",
			);
			return;
		}

		const submitData = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			submitData.append(key, String(value));
		});
		startTransition(() => {
			formAction(submitData);
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input type="hidden" {...register("id")} />
			<Card>
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
					<CardDescription>View and update your preferences.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<FormField
							label="Date Format"
							error={errors.companyName?.message as string}>
							<Input {...register("dateFormat")} placeholder="Date Format" />
						</FormField>
					</div>
					<div className="space-y-2">
						<FormField
							label="Tax Rate"
							error={errors.taxRate?.message as string}>
							<Input {...register("taxRate")} placeholder="Tax Rate" />
						</FormField>
					</div>
					<div className="space-y-2">
						<FormField
							label="Invoice Prefix"
							error={errors.invoicePrefix?.message as string}>
							<Input
								{...register("invoicePrefix")}
								placeholder="Invoice Prefix"
							/>
						</FormField>
					</div>
				</CardContent>
				<CardFooter className="border-t  md:justify-end">
					<Button type="submit" disabled={isSubmitting || !data?.id}>
						{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
						<SaveIcon className="w-4 h-4" />
						Save
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
