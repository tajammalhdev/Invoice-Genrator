import { FormProps } from "../SettingForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { startTransition, useActionState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { updatingTemplate } from "../../../../actions/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, SaveIcon } from "lucide-react";

const templateOptions = [
	{
		id: "1",
		name: "Template 1",
		image: "/invoices/01.jpg",
		description: "Clean and minimal design",
	},
	{
		id: "2",
		name: "Template 2",
		image: "/invoices/02.jpg",
		description: "Professional layout",
	},
	{
		id: "3",
		name: "Template 3",
		image: "/invoices/03.jpg",
		description: "Modern and stylish",
	},
];

export default function InvoicingForm({ data }: FormProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			template: data?.template || "1",
		},
	});

	const [state, formAction, isSubmitting] = useActionState(updatingTemplate, {
		success: false,
		error: false,
	});

	const onSubmit = (formData: any) => {
		startTransition(() => {
			const submitData = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				submitData.append(key, String(value));
			});
			formAction(submitData);
		});
	};

	useEffect(() => {
		if (state.success) {
			toast.success("Invoice template updated successfully");
		}
	}, [state.success]);

	useEffect(() => {
		if (state.error) {
			toast.error("Failed to update invoice template");
		}
	}, [state.error]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardHeader>
					<CardTitle>Invoice Template</CardTitle>
					<CardDescription>
						Choose your preferred invoice template design.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div>
							<h2 className="text-lg font-semibold mb-2">Invoice Template</h2>
						</div>

						<Controller
							name="template"
							control={control}
							render={({ field }) => (
								<RadioGroup
									value={field.value}
									onValueChange={field.onChange}
									className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{templateOptions.map((template) => (
										<Card
											key={template.id}
											className={`cursor-pointer transition-all hover:shadow-md ${
												field.value === template.id
													? "ring-2 ring-primary border-primary"
													: "hover:border-gray-300"
											}`}
											onClick={() => field.onChange(template.id)}>
											<CardContent className="p-4">
												<div className="flex items-center space-x-3">
													<RadioGroupItem
														value={template.id}
														id={template.id}
													/>
													<div className="flex-1">
														<Label
															htmlFor={template.id}
															className="text-sm font-medium cursor-pointer">
															{template.name}
														</Label>
														<p className="text-xs text-muted-foreground mt-1">
															{template.description}
														</p>
													</div>
												</div>
												<div className="mt-3">
													<div className="w-full h-[450px] bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
														<Image
															src={template.image}
															alt={template.name}
															width={1240}
															height={1754}
															className="object-cover w-full h-full absolute top-0 left-0 object-top"
														/>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</RadioGroup>
							)}
						/>
					</div>
				</CardContent>
				<CardFooter className="border-t md:justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
						<SaveIcon className="w-4 h-4" />
						Save Invoice Template
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
