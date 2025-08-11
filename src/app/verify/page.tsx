import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { redirect } from "next/navigation";
import { reqSession } from "../utils/hooks";

export default function VerifyRequest() {
  const session = reqSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email address. Please enter the code to confirm your identity.
          </CardDescription>
        </CardHeader>

        {/* <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input id="code" type="text" placeholder="Enter code" required />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Verify
          </Button>
          <Button variant="outline" className="w-full">
            Resend Code
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  )
}
