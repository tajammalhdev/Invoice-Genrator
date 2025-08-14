import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clients, ClientSchema } from "@/lib/zodSchemas";
import FormInput from "../_shared/FormInput";
import { toast } from "sonner";

type AddClientModelProps = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Clients) => void;
};

export default function AddClientModel({
	isOpen,
	onClose,
	onSubmit,
}: AddClientModelProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		formState: { isSubmitting },
	} = useForm<Clients>({
		resolver: zodResolver(ClientSchema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			phone: "",
			address: "",
			city: "",
			state: "",
			postalCode: "",
			country: "",
		},
	});

	const handleFormSubmit = async (data: Clients) => {
		try {
			const response = await fetch("/api/clients", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(data),
			});
			const json = await response.json();

			if (response.ok) {
				reset();
				toast.success("Client added successfully");
				onClose();
			} else {
				toast.error(json.error);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Client</DialogTitle>
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
							{isSubmitting ? "Adding Client..." : "Add Client"}
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
