import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../FormField";
import { updateCompany } from "../../../../actions/actions";
import { Button } from "@/components/ui/button";
import { Loader2, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/lib/zodSchemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectValue,
	SelectContent,
	SelectTrigger,
	SelectItem,
} from "@/components/ui/select";

export default function CompanyDetails({ data }: { data?: any }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			...data,
		},
	});
	const [state, formAction, isSubmitting] = useActionState(updateCompany, {
		success: false,
		error: false,
	});

	useEffect(() => {
		if (state.success) {
			toast.success("Company details updated successfully");
		}
	}, [state.success]);

	useEffect(() => {
		if (state.error) {
			toast.error("Failed to update company details");
		}
	}, [state.error]);

	const onSubmit = (formData: any) => {
		console.log("Form submitted with data:", formData);
		console.log("Component data prop:", data);

		if (!data?.id) {
			toast.error(
				"Company details not found. Please create company details first.",
			);
			return;
		}

		const submitData = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			submitData.append(key, String(value));
		});

		console.log("Submitting FormData:", Array.from(submitData.entries()));

		startTransition(() => {
			formAction(submitData);
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input type="hidden" {...register("id")} />
			<Card>
				<CardHeader>
					<CardTitle>Company Details</CardTitle>
					<CardDescription>
						View and update your company details.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="info" className="mx-auto w-full ">
						<TabsList className="mb-6 flex w-full justify-start gap-8 border-b bg-transparent pb-0">
							<TabsTrigger
								value="info"
								className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-primary rounded-none bg-transparent px-0 py-2 pb-3 data-[state=active]:border-b-2 data-[state=active]:bg-transparent">
								Company Details
							</TabsTrigger>
							<TabsTrigger
								value="address"
								className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-primary rounded-none bg-transparent px-0 py-2 pb-3 data-[state=active]:border-b-2 data-[state=active]:bg-transparent">
								Address
							</TabsTrigger>
						</TabsList>
						<TabsContent value="info">
							<Card className="w-full shadow-none border-none">
								<CardHeader>
									<CardTitle>Company Details</CardTitle>
									<CardDescription>
										View and update your company details.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="col-span-12 space-y-4 md:space-y-6 lg:col-span-12">
										<div className="space-y-2">
											<FormField
												label="Company Name"
												error={errors.companyName?.message as string}>
												<Input
													{...register("companyName")}
													placeholder="Company Name"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="Company Email"
												error={errors.companyEmail?.message as string}>
												<Input
													{...register("companyEmail")}
													placeholder="Company Email"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="Company Phone"
												error={errors.companyPhone?.message as string}>
												<Input
													{...register("companyPhone")}
													placeholder="Company Phone"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="Currency"
												error={errors.currency?.message as string}>
												<Select
													value={watch("currency") || data?.currency || "USD"}
													onValueChange={(value) =>
														setValue("currency", value)
													}>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Currency" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="USD">USD</SelectItem>
														<SelectItem value="EUR">EUR</SelectItem>
														<SelectItem value="GBP">GBP</SelectItem>
														<SelectItem value="CAD">CAD</SelectItem>
														<SelectItem value="AUD">AUD</SelectItem>
														<SelectItem value="NZD">NZD</SelectItem>
														<SelectItem value="CHF">CHF</SelectItem>
													</SelectContent>
												</Select>
											</FormField>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="address">
							<Card className="w-full shadow-none border-none">
								<CardHeader>
									<CardTitle>Company Address</CardTitle>
									<CardDescription>
										View and update your company address.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="col-span-12 space-y-4 md:space-y-6 lg:col-span-12">
										<div className="space-y-2">
											<FormField
												label="Address Line 1"
												error={errors.addressLine1?.message as string}>
												<Input
													{...register("addressLine1")}
													placeholder="Address Line 1"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="Address Line 2"
												error={errors.addressLine2?.message as string}>
												<Input
													{...register("addressLine2")}
													placeholder="Address Line 2"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="City"
												error={errors.city?.message as string}>
												<Input {...register("city")} placeholder="City" />
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="State/Province"
												error={errors.state?.message as string}>
												<Input
													{...register("state")}
													placeholder="State/Province"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="Postal Code"
												error={errors.postalCode?.message as string}>
												<Input
													{...register("postalCode")}
													placeholder="Postal Code"
												/>
											</FormField>
										</div>
										<div className="space-y-2">
											<FormField
												label="Country"
												error={errors.country?.message as string}>
												<Input {...register("country")} placeholder="Country" />
											</FormField>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter className="border-t  md:justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
						<SaveIcon className="w-4 h-4" />
						Save
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
