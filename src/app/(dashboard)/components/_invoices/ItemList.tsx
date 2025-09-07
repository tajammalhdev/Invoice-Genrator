import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableRow,
	TableHead,
	TableHeader,
	TableBody,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

type ItemListProps = {
	children: React.ReactNode;
	addItem: () => void;
};

export default function ItemList({ children, addItem }: ItemListProps) {
	return (
		<Card className="w-full shadow-none py-0 overflow-hidden border border-border dark:border-border rounded-none my-6 gap-0">
			<CardContent className="p-0">
				<div className="flex items-center justify-between">
					<Table className="min-w-full table-auto">
						<TableHeader className="bg-primary text-white dark:bg-secondary hover:bg-primary/80">
							<TableRow>
								<TableHead className="text-left text-white px-5">
									Item
								</TableHead>
								<TableHead className="text-left text-white px-5">
									Description
								</TableHead>
								<TableHead className="text-left text-white px-5">
									Quantity
								</TableHead>
								<TableHead className="text-left text-white">
									Unit Price
								</TableHead>
								<TableHead className="text-left text-white">Total</TableHead>
								<TableHead className="text-center text-white"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="bg-white dark:bg-card">{children}</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter className="p-0">
				<Button
					type="button"
					variant="outline"
					onClick={addItem}
					className="w-full py-8 inline-flex justify-center items-center space-x-2 rounded-none border-0 cursor-pointer hover:bg-muted dark:hover:bg-muted">
					<Plus className="h-4 w-4" />
					Add Item
				</Button>
			</CardFooter>
		</Card>
	);
}
