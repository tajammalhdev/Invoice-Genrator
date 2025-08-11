"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
}
export default function SubmitButton({ children, className }: SubmitButtonProps) {
    const {pending} = useFormStatus();

    return <Button type="submit"  className={cn("w-full bg-black text-white", className)}>
        {children}
        {pending && <Loader2 className="w-4 h-4 animate-spin ml-2" />} 
    </Button>
}