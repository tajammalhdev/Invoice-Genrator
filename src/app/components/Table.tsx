import { cn } from "@/lib/utils";

const Table = ({
	columns,
	renderRow,
	data,
}: {
	columns: { header: string; accessor: string; className?: string }[];
	renderRow: (item: any) => React.ReactNode;
	data: any[];
}) => {
	return (
		<table className="w-full mt-2">
			<thead>
				<tr className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-left text-sm">
					{columns.map((col) => (
						<th
							key={col.accessor}
							className={cn(
								"p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
								col.className,
							)}>
							{col.header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>{data.map((item) => renderRow(item))}</tbody>
		</table>
	);
};

export default Table;
