"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useActionState } from "react";
import { FormContainerProps } from "./FormContainer";
import { toast } from "sonner";
import { deleteClient } from "../../../actions/actions";
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ClientForm = dynamic(() => import("./forms/ClientForm"), {
	loading: () => <h1>Loading...</h1>,
});

const deleteActionMap = {
	client: deleteClient,
};
const forms: {
	[key: string]: (
		setOpen: Dispatch<SetStateAction<boolean>>,
		type: "create" | "update",
		data?: any,
		relatedData?: any,
	) => React.ReactElement;
} = {
	client: (setOpen, type, data, relatedData) => (
		<ClientForm
			setOpen={setOpen}
			type={type}
			data={data}
			relatedData={relatedData}
		/>
	),
};

const FormModal = ({
	table,
	type,
	data,
	id,
	relatedData,
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
		const [state, formAction] = useActionState(deleteActionMap[table], {
			success: false,
			error: false,
		});

		const router = useRouter();

		useEffect(() => {
			if (state.success) {
				toast(`${table} has been deleted!`);
				setOpen(false);
				router.refresh();
			}
		}, [state, router]);

		return type === "delete" && id ? (
			<form action={formAction} className="p-4 flex flex-col gap-4">
				<input type="hidden" name="id" defaultValue={id} />
				<span className="text-center font-medium">
					All data will be lost. Are you sure you want to delete this {table}?
				</span>
				<button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
					Delete
				</button>
			</form>
		) : type === "create" || type === "update" ? (
			forms[table](setOpen, type, data, relatedData)
		) : (
			"Form not found!"
		);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Button
				className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
				onClick={() => setOpen(true)}
				variant="outline"
				size="icon">
				{type === "create" && (
					<PlusIcon className="size-4 shrink-0 opacity-50" />
				)}
				{type === "update" && (
					<EditIcon className="size-4 shrink-0 opacity-50" />
				)}
				{type === "delete" && (
					<Trash2Icon className="size-4 shrink-0 opacity-50" />
				)}
			</Button>
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
	);
};

export default FormModal;
