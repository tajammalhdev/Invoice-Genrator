import { reqSession } from "@/lib/hooks";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SettingsContainer from "@/app/components/SettingsContainer";

export default async function Settings() {
	const session = await reqSession();
	const settings = await prisma.setting.findUnique({
		where: {
			userId: session.user.id,
		},
	});

	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6">
			<SettingsContainer settings={settings} />
		</div>
	);
}
