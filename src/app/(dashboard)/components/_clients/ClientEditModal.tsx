import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Clients } from "@/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientSchema } from "@/lib/zodSchemas";
import FormInput from "../_shared/FormInput";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ClientEditModal({
	client,
	isOpen,
	onClose,
	onUpdate,
}: {
	client: Clients;
	isOpen: boolean;
	onClose: () => void;
	onUpdate?: (updatedClient: Clients) => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		formState: { isSubmitting },
	} = useForm<Clients>({
		resolver: zodResolver(ClientSchema),
	});

	const handleFormSubmit = async (data: Clients) => {
		try {
			const response = await fetch(`/api/clients`, {
				method: "PUT",
				body: JSON.stringify({ clientId: client.id, ...data }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const updatedClient = { ...client, ...data };
				toast.success("Client updated successfully");

				// Notify parent component about the update
				if (onUpdate) {
					onUpdate(updatedClient);
				}

				onClose();
			} else {
				toast.error("Failed to update client");
			}
		} catch (error) {
			toast.error("Failed to update client");
		}
	};

	useEffect(() => {
		setValue("name", client.name);
		setValue("email", client.email);
		setValue("company", client.company);
		setValue("phone", client.phone);
		setValue("address", client.address);
		setValue("city", client.city);
		setValue("state", client.state);
		setValue("postalCode", client.postalCode);
		setValue("country", client.country);
	}, [client]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl">Client Details</DialogTitle>
					<p className="text-muted-foreground">
						View complete client information
					</p>
				</DialogHeader>
				<form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
							Basic Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<FormInput
									name="name"
									label="Name"
									placeholder="Client name"
									required
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="email"
									label="Email"
									type="email"
									placeholder="client@example.com"
									required
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="company"
									label="Company"
									placeholder="Company name"
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="phone"
									label="Phone"
									placeholder="Phone number"
									register={register}
									errors={errors}
								/>
							</div>
						</div>
					</div>

					{/* Address Information */}
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
							Address Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2 md:col-span-2">
								<FormInput
									name="address"
									label="Street Address"
									placeholder="Street address"
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="city"
									label="City"
									placeholder="City"
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="state"
									label="State/Province"
									placeholder="State/Province"
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="postalCode"
									label="Postal Code"
									placeholder="Postal code"
									register={register}
									errors={errors}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									name="country"
									label="Country"
									placeholder="Country"
									register={register}
									errors={errors}
								/>
							</div>
						</div>
					</div>

					{/* Form Actions */}
					<div className="flex gap-3 pt-4 border-t">
						<Button type="submit" className="flex-1" disabled={isSubmitting}>
							{isSubmitting ? "Updating Client..." : "Update Client"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1">
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
