import { reqSession } from "@/lib/hooks";
import { redirect } from "next/navigation";
import SettingsForm from "../components/_settings/SettingsForm";

export default async function Settings() {
	const session = await reqSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6">
			<SettingsForm />
		</div>
	);
}
