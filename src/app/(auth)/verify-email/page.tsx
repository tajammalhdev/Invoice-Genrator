"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { redirect, useRouter } from "next/navigation";
import { reqSession } from "../../../lib/hooks";
import { ArrowLeft } from "lucide-react";

export default function VerifyEmail() {
	const router = useRouter();
	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center space-y-2">
				<CardTitle className="text-3xl font-bold">Check your email</CardTitle>
				<CardDescription>
					We've sent a verification link to your email address. Please click the
					link to confirm your identity.
				</CardDescription>
			</CardHeader>

			<CardFooter className="flex flex-col gap-2">
				<Button
					variant="outline"
					className="w-full"
					onClick={() => router.back()}>
					<ArrowLeft className="size-4" />
					Back to Login
				</Button>
			</CardFooter>
		</Card>
	);
}
