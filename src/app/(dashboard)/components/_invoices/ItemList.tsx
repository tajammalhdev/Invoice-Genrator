import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

type ItemListProps = {
	children: React.ReactNode;
	addItem: () => void;
};

export default function ItemList({ children, addItem }: ItemListProps) {
	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Invoice Items</CardTitle>
					<Button
						type="button"
						variant="outline"
						onClick={addItem}
						className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Add Item
					</Button>
				</div>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
