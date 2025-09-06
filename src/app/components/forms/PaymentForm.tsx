import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dispatch,
	SetStateAction,
	useActionState,
	startTransition,
	useEffect,
} from "react";
import { PaymentSchema, PaymentSchemaValidation } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPayment, updatePayment } from "../../../../actions/actions";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
interface PaymentFormProps {
	type: "create" | "update";
	data?: PaymentSchemaValidation;
	setOpen: Dispatch<SetStateAction<boolean>>;
	relatedData: any;
}

export default function PaymentForm({
	type,
	data,
	setOpen,
	relatedData,
}: PaymentFormProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(PaymentSchema),
		defaultValues: relatedData,
	});

	const [state, formAction, isSubmitting] = useActionState(
		type === "create" ? createPayment : updatePayment,
		{
			success: false,
			error: false,
		},
	);
	const onSubmit = (data: any) => {
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
			<div className="space-y-4">
				<h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
					Payment Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Controller
							name="invoiceId"
							control={control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Invoice" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="0">Select an invoice</SelectItem>
										<SelectSeparator />
										<SelectGroup>
											{relatedData?.invoices?.map((invoice: any) => (
												<SelectItem key={invoice.number} value={invoice.number}>
													{invoice.number}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.invoiceId && (
							<p className="text-sm text-red-500">
								{String(errors.invoiceId.message)}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="Amount" required {...register("amount")} />
						{errors.amount && (
							<p className="text-sm text-red-500">
								{String(errors.amount.message)}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Input placeholder="Method" required {...register("method")} />
						{errors.method && (
							<p className="text-sm text-red-500">
								{String(errors.method.message)}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<input
							type="date"
							placeholder="Date"
							required
							{...register("receivedAt", {
								valueAsDate: false,
							})}
							className="w-full py-2 px-3 rounded-md text-sm disabled:opacity-75  selection:text-primary-foreground dark:bg-input/30 border-input bg-transparent disabled:cursor-not-allowed undefined border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px"
						/>
						{errors.receivedAt && (
							<p className="text-sm text-red-500">
								{String(errors.receivedAt.message)}
							</p>
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
}
