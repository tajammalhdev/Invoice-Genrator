"use client";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageIcon, UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Settings } from "@/lib/zodSchemas";
import FormInput from "../_shared/FormInput";

export default function BasicInfo() {
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<Settings>();

	const watchedLogoUrl = watch("logoUrl");
	const [logoUrl, setLogoUrl] = useState<string>("");

	// Update logoUrl when form value changes
	useEffect(() => {
		if (watchedLogoUrl) {
			setLogoUrl(watchedLogoUrl);
		}
	}, [watchedLogoUrl]);

	// Update logoUrl when form value changes
	const handleLogoUpload = (url: string) => {
		setLogoUrl(url);
		setValue("logoUrl", url);
	};

	// Initialize logoUrl from form data on mount
	useEffect(() => {
		if (watchedLogoUrl && !logoUrl) {
			setLogoUrl(watchedLogoUrl);
		}
	}, [watchedLogoUrl, logoUrl]);

	return (
		<>
			<Card className="border-none shadow-none">
				<CardHeader>
					<CardTitle>Basic Info</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<FormInput
							label="Company Name"
							name="companyName"
							register={register}
							errors={errors}
							placeholder="Acme Inc"
							type="text"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							label="Company Email"
							name="companyEmail"
							register={register}
							errors={errors}
							placeholder="billing@acme.com"
							type="email"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							label="Company Phone"
							name="companyPhone"
							register={register}
							errors={errors}
							placeholder="+1 555 123 4567"
							type="tel"
						/>
					</div>
					<div className="space-y-2 md:col-span-2">
						<Label>Company Logo</Label>
						<LogoUploader onUploaded={handleLogoUpload} currentUrl={logoUrl} />
					</div>
				</CardContent>
			</Card>
		</>
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
