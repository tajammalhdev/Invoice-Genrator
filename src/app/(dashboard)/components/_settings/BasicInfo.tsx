"use client";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageIcon, UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Settings } from "@/lib/zodSchemas";
import FormInput from "../_shared/FormInput";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { imabebase64 } from "@/lib/utils";

export default function BasicInfo() {
	const {
		register,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<Settings>();

	const [logo, setLogo] = useState<string>();
	const watchedLogoUrl = watch("logoUrl");
	useEffect(() => {
		if (watchedLogoUrl) {
			setLogo(watchedLogoUrl);
		}
	}, [watchedLogoUrl]);
	// Update logo when form value changes (from fetched data)
	// Handle logo selection (just set state, no upload)
	const handleOnChangeLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// Create a preview URL for display
		const files = e.target.files;

		if (!files || files.length < 0) return;

		const file = files[0];

		//image to base64
		const image = await imabebase64(file);

		setLogo(image);
		setValue("logoUrl", image);
	};

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
						<Input
							type="file"
							className="max-w-sm w-full cursor-pointer "
							onChange={handleOnChangeLogo}
							required
							accept="image/*"
						/>
						{errors.logoUrl && (
							<p className="text-sm text-destructive">
								{errors.logoUrl.message}
							</p>
						)}
						<div className="w-full max-w-xs">
							{logo ? (
								<Image
									className="aspect-video h-20 border-2 border-dotted max-h-20 object-scale-down"
									src={logo}
									width={250}
									height={96}
									alt="Invoice logo"
								/>
							) : (
								<div className="aspect-video h-20 border-2 border-dotted flex justify-center items-center rounded-lg">
									<p className="text-center text-muted-foreground">No Data</p>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
