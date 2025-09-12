"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useActionState } from "react";
import { FormContainerProps } from "./FormContainer";
import { toast } from "sonner";
import {
	deleteClient,
	deleteInvoice,
	generateInvoicePdf,
} from "../../../actions/actions";
import {
	Download,
	EditIcon,
	FileTextIcon,
	Loader2,
	MailIcon,
	PlusIcon,
	Trash2Icon,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PaymentForm from "./forms/PaymentForm";
import EmailForm from "./forms/EmailForm";

const ClientForm = dynamic(() => import("./forms/ClientForm"), {
	loading: () => <h1>Loading...</h1>,
});

const deleteActionMap = {
	client: deleteClient,
	invoice: deleteInvoice,
};
const pdfActionMap = {
	invoice: generateInvoicePdf,
};
export interface FormProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
	type: "create" | "update" | "email";
	data?: any;
	relatedData?: any;
}
const forms: {
	[key: string]: (props: FormProps) => React.ReactElement;
} = {
	client: (props) => (
		<ClientForm
			setOpen={props.setOpen}
			type={props.type}
			data={props.data}
			relatedData={props.relatedData}
		/>
	),
	payment: (props) => (
		<PaymentForm
			setOpen={props.setOpen}
			type={props.type}
			data={props.data}
			relatedData={props.relatedData}
		/>
	),
	Email: (props) => (
		<EmailForm
			setOpen={props.setOpen}
			type={props.type}
			data={props.data}
			relatedData={props.relatedData}
		/>
	),
};

const FormModal = ({
	table,
	type,
	data,
	id,
	relatedData,
	label,
}: FormContainerProps & { relatedData?: any }) => {
	const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
	const bgColor =
		type === "create"
			? "bg-lamaYellow"
			: type === "update"
			? "bg-lamaSky"
			: "bg-lamaPurple";

	const [open, setOpen] = useState(false);

	const Form = () => {
		const [state, formAction, isSubmitting] = useActionState(
			deleteActionMap[table as keyof typeof deleteActionMap] ||
				(() => Promise.resolve({ success: false, error: false })),
			{
				success: false,
				error: false,
			},
		);

		const [pdfState, pdfAction, isPdfSubmitting] = useActionState(
			pdfActionMap[table as keyof typeof pdfActionMap] ||
				(() => Promise.resolve({ success: false, error: false })),
			{
				success: false,
				error: false,
			} as any,
		);

		console.log("PDF action:", pdfAction);
		console.log("Table:", table);
		console.log("PDF action map:", pdfActionMap);

		const router = useRouter();

		useEffect(() => {
			if (state.success) {
				toast(`${table} has been deleted!`);
				setOpen(false);
				router.refresh();
			}
			if (state.error) {
				console.error("Delete error:", state.error);
				toast(`Error deleting ${table}: ${state.error}`);
			}
		}, [state, router]);

		useEffect(() => {
			if (pdfState.success) {
				toast(`PDF has been generated!`);

				// Handle PDF download if pdfData is available
				if (pdfState.pdfData && pdfState.filename) {
					const link = document.createElement("a");
					link.href = `data:application/pdf;base64,${pdfState.pdfData}`;
					link.download = pdfState.filename;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}

				setOpen(false);
				router.refresh();
			}
			if (pdfState.error) {
				console.error("PDF generation error:", pdfState.error);
				console.error("Full PDF state:", pdfState);
				toast(`Error generating PDF: ${pdfState.error}`);
			}
		}, [pdfState, router]);

		return type === "delete" && id ? (
			<form action={formAction} className="p-4 flex flex-col gap-4">
				<input type="hidden" name="id" defaultValue={id} />
				<span className="text-center font-medium">
					All data will be lost. Are you sure you want to delete this {table}?
				</span>

				<button
					className="bg-red-700 text-white py-2 px-6 flex items-center justify-center rounded-md border-none w-max self-center"
					disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Delete
						</>
					) : (
						"Delete"
					)}
				</button>
			</form>
		) : type === "pdf" && id ? (
			<form
				action={pdfAction}
				className="p-4 flex flex-col gap-4"
				onSubmit={(e) => {
					console.log("PDF form submitted");
					console.log("Form action:", pdfAction);
					console.log("Form data:", new FormData(e.currentTarget));
				}}>
				<input type="hidden" name="id" defaultValue={id} />
				<span className="text-center font-medium">
					Are you sure you want to generate the PDF for this invoice?
				</span>
				<button
					type="submit"
					className="bg-lamaYellow text-white py-2 px-6 flex items-center justify-center rounded-md border-none w-max self-center"
					disabled={isPdfSubmitting}>
					{isPdfSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Generate PDF
						</>
					) : (
						"Generate PDF"
					)}
				</button>
			</form>
		) : type === "create" || type === "update" || type === "email" ? (
			forms[table]({ setOpen, type, data, relatedData })
		) : (
			"Form not found!"
		);
	};

	return (
		<>
			<Button
				className={
					label
						? `w-full flex items-center justify-center border-none !bg-transparent`
						: `${size} flex items-center justify-center rounded-full ${bgColor}`
				}
				onClick={() => setOpen(true)}
				variant="outline"
				size="icon">
				{type === "create" && (
					<>
						<PlusIcon className="size-4 shrink-0 opacity-50" />
						{label}
					</>
				)}
				{type === "update" && (
					<>
						<EditIcon className="size-4 shrink-0 opacity-50" />
						{label}
					</>
				)}
				{type === "pdf" && (
					<>
						<Download className="size-4 shrink-0 opacity-50" />
						{label}
					</>
				)}
				{type === "delete" && (
					<>
						<Trash2Icon className="size-4 shrink-0 opacity-50" />
						{label}
					</>
				)}
				{type === "email" && (
					<>
						<MailIcon className="size-4 shrink-0 opacity-50" />
						{label}
					</>
				)}
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="right" className="w-[400px] sm:max-w-[400px] p-5">
					<SheetHeader className="mb-4 px-0">
						<SheetTitle className="capitalize">
							{type} {table}
						</SheetTitle>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto">
						<Form />
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default FormModal;
