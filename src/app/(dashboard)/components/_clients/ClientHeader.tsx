import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClientHeader({
	setShowAddModal,
}: {
	setShowAddModal: (show: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Clients</h1>
				<p className="text-muted-foreground">
					Manage your clients and their information
				</p>
			</div>
			<Button
				className="flex items-center gap-2"
				onClick={() => setShowAddModal(true)}>
				<Plus className="h-4 w-4" />
				Add New Client
			</Button>
		</div>
	);
}
