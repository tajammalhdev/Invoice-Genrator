import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "../../../lib/auth";
import SubmitButton from "../../components/SubmitButton";
import { redirect } from "next/navigation";

export default async function Login() {
	const session = await auth();
	if (session?.user) {
		redirect("/dashboard");
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
				<CardAction>
					<Button variant="link">Sign Up</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<form
					action={async (formData: FormData) => {
						"use server";
						await signIn("nodemailer", formData);
					}}>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							{/* <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div> */}
							{/* <Input id="password" type="password" required  name=""/> */}
							<SubmitButton className="w-full bg-black text-white">
								Login
							</SubmitButton>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
