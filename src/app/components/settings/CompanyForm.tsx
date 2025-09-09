import { useForm } from "react-hook-form";
import FormField from "../FormField";
import { FormProps } from "../SettingForm";
import { SettingsSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, SaveIcon, UploadIcon } from "lucide-react";
import { startTransition, useActionState } from "react";
import { updateCompany } from "../../../../actions/actions";
import { toast } from "sonner";
import { useEffect } from "react";
import CompanyLogo from "./CompanyLogo";
import CompanyDetails from "./CompanyDetails";

export default function CompanyForm({ data }: FormProps) {
	return (
		<section className="mb-8 grid grid-cols-1 gap-4 ">
			<CompanyLogo data={data} />
			<CompanyDetails data={data} />
		</section>
	);
}
