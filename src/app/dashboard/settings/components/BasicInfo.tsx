"use client";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/app/components/SubmitButton";
import { ImageIcon, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateBasicSettings } from "../../../../../actions/settings";
import { BasicInfoSchema, type BasicInfo } from "@/app/utils/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { useSettings } from "@/app/contexts/SettingsContext";
import { useSettingsForm } from "@/app/hooks/useSettingsForm";

export default function BasicInfo() {
	const { settings } = useSettings();
	const { formAction, isSubmitting } = useSettingsForm({
		action: updateBasicSettings,
		successMessage: "Company information updated successfully!",
	});

	const [form, fields] = useForm<BasicInfo>({
		onValidate({ formData }) {
			return parseWithValibot(formData, { schema: BasicInfoSchema });
		},
		shouldRevalidate: "onInput",
		shouldValidate: "onBlur",
	});

	const [logoUrl, setLogoUrl] = useState<string>(settings?.logoUrl ?? "");

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<form
				noValidate
				className="grid grid-cols-1 gap-6"
				id={form.id}
				action={formAction}
				onSubmit={form.onSubmit}>
				<Card className="border-none shadow-none">
					<CardHeader>
						<CardTitle>Company Info</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="companyName">Company Name</Label>
							<Input
								placeholder="Acme Inc"
								name="companyName"
								defaultValue={settings?.companyName}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="companyEmail">Company Email</Label>
							<Input
								type="email"
								placeholder="billing@acme.com"
								name="companyEmail"
								defaultValue={settings?.companyEmail}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="companyPhone">Phone</Label>
							<Input
								placeholder="+1 555 123 4567"
								name="companyPhone"
								defaultValue={settings?.companyPhone}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label>Company Logo</Label>
							<LogoUploader
								onUploaded={(url) => {
									setLogoUrl(url);
								}}
								currentUrl={logoUrl}
							/>
							<input type="hidden" name="logoUrl" value={logoUrl} />
						</div>
					</CardContent>
					<CardFooter>
						<SubmitButton className="w-auto">Save Settings</SubmitButton>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}

function LogoUploader({
	onUploaded,
	currentUrl,
}: {
	onUploaded: (url: string) => void;
	currentUrl: string;
}) {
	const [dragOver, setDragOver] = useState(false);
	const [uploading, setUploading] = useState(false);

	async function upload(file: File) {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const res = await fetch("/api/uploads", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.error ?? "Upload failed");
			}

			const data = await res.json();
			onUploaded(data.url);
			toast.success("Logo uploaded successfully");
		} catch (e) {
			const message = e instanceof Error ? e.message : "Upload failed";
			toast.error(message);
		} finally {
			setUploading(false);
			setDragOver(false);
		}
	}

	function onDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files?.[0];
		if (file) upload(file);
	}

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.target.files?.[0];
		if (file) upload(file);
	}

	return (
		<div
			onDragOver={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setDragOver(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setDragOver(false);
			}}
			onDrop={onDrop}
			className={`border rounded-md p-4 flex items-center justify-between gap-4 transition-colors ${
				dragOver ? "border-ring bg-accent/30" : "border-input"
			}`}>
			<div className="flex items-center gap-3">
				<div className="size-12 grid place-items-center rounded bg-muted/50 border">
					{currentUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={currentUrl}
							alt="Logo"
							className="max-h-12 max-w-12 object-contain"
						/>
					) : (
						<ImageIcon className="size-6 text-muted-foreground" />
					)}
				</div>
				<div className="space-y-1">
					<div className="text-sm font-medium">Drag and drop your logo</div>
					<div className="text-xs text-muted-foreground">
						PNG, JPG, WEBP, GIF, or SVG up to 5MB
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<label className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border cursor-pointer hover:bg-accent">
					<UploadCloud className="size-4" />
					<span>{uploading ? "Uploading..." : "Choose file"}</span>
					<input
						type="file"
						accept="image/*"
						className="hidden"
						onChange={onChange}
						disabled={uploading}
					/>
				</label>
			</div>
		</div>
	);
}
