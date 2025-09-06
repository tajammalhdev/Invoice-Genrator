import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientSchema, Clients } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@prisma/client";
import { FormInput } from "lucide-react";
import {
	Dispatch,
	SetStateAction,
	useActionState,
	useEffect,
	startTransition,
} from "react";
import { useForm } from "react-hook-form";
import { createClient, updateClient } from "../../../../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ClientFormProps {
	type: "create" | "update";
	data?: Clients;
	setOpen: Dispatch<SetStateAction<boolean>>;
	relatedData: any;
}

const ClientForm = ({ type, data, setOpen, relatedData }: ClientFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Clients>({
		resolver: zodResolver(ClientSchema),
		defaultValues: relatedData,
	});

	const [state, formAction, isSubmitting] = useActionState(
		type === "create" ? createClient : updateClient,
		{
			success: false,
			error: false,
		},
	);

	const onSubmit = (data: Clients) => {
		startTransition(() => {
			formAction({ ...data });
		});
	};

	const router = useRouter();
	useEffect(() => {
		if (state.success) {
			toast(`Client has been ${type === "create" ? "created" : "updated"}!`);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	return (
		<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
			{/* Basic Information */}
			<div className="space-y-4">
				<h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
					Basic Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Input placeholder="Client name" required {...register("name")} />
					</div>
					<div className="space-y-2">
						<Input
							type="email"
							placeholder="client@example.com"
							required
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="Company name" {...register("company")} />
						{errors.company && (
							<p className="text-sm text-red-500">{errors.company.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="Phone number" {...register("phone")} />
						{errors.phone && (
							<p className="text-sm text-red-500">{errors.phone.message}</p>
						)}
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
						<Input placeholder="Street address" {...register("address")} />
						{errors.address && (
							<p className="text-sm text-red-500">{errors.address.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="City" {...register("city")} />
						{errors.city && (
							<p className="text-sm text-red-500">{errors.city.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="State/Province" {...register("state")} />
						{errors.state && (
							<p className="text-sm text-red-500">{errors.state.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="Postal code" {...register("postalCode")} />
						{errors.postalCode && (
							<p className="text-sm text-red-500">
								{errors.postalCode.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="Country" {...register("country")} />
						{errors.country && (
							<p className="text-sm text-red-500">{errors.country.message}</p>
						)}
					</div>
				</div>
			</div>

			{/* Form Actions */}
			<div className="flex gap-3 pt-4 border-t">
				<Button type="submit" className="flex-1" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit"}
				</Button>
			</div>
		</form>
	);
};

export default ClientForm;
