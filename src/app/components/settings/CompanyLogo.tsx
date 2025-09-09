import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader2, SaveIcon, UploadIcon } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadLogo } from "../../../../actions/actions";
import { toast } from "sonner";

export default function CompanyLogo({ data }: { data?: any }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [logo, setLogo] = useState<File | null>(null);
	const [logoUrl, setLogoUrl] = useState<string | null>(data?.logoUrl || null);
	const [isUploading, setIsUploading] = useState(false);

	const [state, formAction, isSubmitting] = useActionState(uploadLogo, {
		success: false,
		error: false,
	});

	const handleFileUpload = async (file: File) => {
		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/uploads", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const result = await response.json();
			setLogoUrl(result.url);
			toast.success("Logo uploaded successfully");
		} catch (error) {
			toast.error("Failed to upload logo");
		} finally {
			setIsUploading(false);
		}
	};

	const onSubmit = (formData: any) => {
		if (!logoUrl) {
			toast.error("Please upload a logo first");
			return;
		}

		if (!data?.id) {
			toast.error(
				"Company settings not found. Please create company settings first.",
			);
			return;
		}

		const submitData = new FormData();
		submitData.append("id", data.id);
		submitData.append("logoUrl", logoUrl);

		startTransition(() => {
			formAction(submitData);
		});
	};

	useEffect(() => {
		if (state.success) {
			toast.success("Company logo updated successfully");
		}
	}, [state.success]);

	useEffect(() => {
		if (state.error) {
			toast.error("Failed to update company logo");
		}
	}, [state.error]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardHeader>
					<CardTitle>Company Logo</CardTitle>
					<CardDescription>
						Upload your company logo - everyone who visits your profile will see
						this.
					</CardDescription>
				</CardHeader>
				<CardContent className="px-6 flex items-center gap-4">
					<div className="flex items-center gap-4">
						<Avatar className="w-16 h-16 object-cover">
							<AvatarImage
								src={logoUrl || ""}
								alt="Company Logo"
								className="object-cover"
							/>
							<AvatarFallback>LOGO</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-2">
							<input
								type="file"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										setLogo(file);
										handleFileUpload(file);
									}
								}}
								className="hidden"
								id="logo-upload"
							/>

							<Button
								variant="outline"
								type="button"
								disabled={isUploading}
								onClick={() => document.getElementById("logo-upload")?.click()}>
								{isUploading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<UploadIcon className="w-4 h-4" />
								)}
								{isUploading ? "Uploading..." : "Upload Logo"}
							</Button>
							{logoUrl && (
								<p className="text-xs text-muted-foreground">
									Logo uploaded successfully
								</p>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="border-t md:justify-end">
					<Button
						type="submit"
						disabled={isSubmitting || !logoUrl || !data?.id}>
						{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
						<SaveIcon className="w-4 h-4" />
						Save Logo
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
