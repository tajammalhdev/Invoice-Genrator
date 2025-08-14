"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
	Badge,
	Building2,
	Copy,
	Edit,
	Eye,
	Mail,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import AddClientModel from "../components/_clients/AddClientModel";
import type { Clients } from "@/lib/zodSchemas";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "date-fns";
import { copyToClipboard } from "@/lib/utils";

export default function Clients() {
	const [showAddModal, setShowAddModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [clients, setClients] = useState<Clients[] | null>(null);
	const [filteredClients, setFilteredClients] = useState<Clients[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		fetchClients();
	}, []);

	const handleSearch = () => {
		if (clients) {
			filterClients(clients, searchTerm);
		}
	};

	const filterClients = useCallback(
		(clients: Clients[], searchTerm: string) => {
			const filtered = clients.filter(
				(client) =>
					client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(client.company &&
						client.company.toLowerCase().includes(searchTerm.toLowerCase())),
			);
			setFilteredClients(filtered);
		},
		[searchTerm],
	);

	const fetchClients = useCallback(async () => {
		try {
			const response = await fetch("/api/clients", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setClients(data);
			}
		} catch (error) {
			toast.error("Failed to fetch clients");
		} finally {
			setIsLoading(false);
		}
	}, []);

	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6">
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

			{/* Filters and Search */}
			<Card className="mt-5 shadow-none">
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search invoices, clients..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={handleSearch}>
							<Filter className="h-4 w-4 mr-2" />
							Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Clients Table */}
			{/* Clients List */}
			<Card className="mt-5 shadow-none">
				<CardHeader>
					<CardTitle>Client Directory</CardTitle>
				</CardHeader>
				<CardContent>
					{clients && (
						<div className="space-y-3">
							{clients.map((client, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
									<div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
										<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
											<span className="text-primary font-semibold text-sm">
												{/* {getInitials(client.name)} */}
											</span>
										</div>
										<div className="min-w-0 flex-1">
											<h3 className="font-medium truncate">{client.name}</h3>
											<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground space-y-1 sm:space-y-0">
												{client.email && (
													<span className="flex items-center truncate">
														<Mail className="h-3 w-3 mr-1 flex-shrink-0" />
														<span className="truncate">{client.email}</span>
													</span>
												)}
												{client.company && (
													<span className="flex items-center truncate">
														<Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
														<span className="truncate">{client.company}</span>
													</span>
												)}
												{client.phone && (
													<span className="flex items-center truncate">
														<Phone className="h-3 w-3 mr-1 flex-shrink-0" />
														<span className="truncate">{client.phone}</span>
													</span>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-2 flex-shrink-0">
										{/* <Badge
											variant="outline"
											className="text-xs hidden sm:block">
											{formatDate(client?.createdAt, "MMM d, yyyy")}
										</Badge> */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>
													<Eye className="h-4 w-4 mr-2" />
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Edit className="h-4 w-4 mr-2" />
													Edit Client
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => copyToClipboard(client.email)}>
													<Copy className="h-4 w-4 mr-2" />
													Copy Email
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-destructive focus:text-destructive">
													<Trash2 className="h-4 w-4 mr-2" />
													Delete Client
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<AddClientModel
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={() => {}}
			/>
		</div>
	);
}
