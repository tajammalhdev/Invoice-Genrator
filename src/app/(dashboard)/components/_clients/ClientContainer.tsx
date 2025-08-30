"use client";
import { useEffect, useState } from "react";
import { Clients } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { useCallback } from "react";
import AddClientModel from "./AddClientModel";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, Home, Plus } from "lucide-react";
import { Copy } from "lucide-react";
import { Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import ClientDetailsModal from "./ClientDetailsModal";
import ClientEditModal from "./ClientEditModal";
import { DataTable } from "@/components/ui/DateTable";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/app/components/Loading";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ClientContainer() {
	const [showAddModal, setShowAddModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [clients, setClients] = useState<Clients[] | null>(null);
	const [filteredClients, setFilteredClients] = useState<Clients[]>([]);
	const [page, setPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [totalPage, setTotalPage] = useState<number>(1);
	const [selectedClient, setSelectedClient] = useState<Clients | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleEditClient = (client: Clients) => {
		setSelectedClient(client);
		setShowEditModal(true);
	};

	const handleViewDetails = (client: Clients) => {
		setSelectedClient(client);
		setShowDetailsModal(true);
	};

	const handleCloseDetails = () => {
		setShowDetailsModal(false);
		setSelectedClient(null);
	};

	const handleCloseEdit = () => {
		setShowEditModal(false);
		setSelectedClient(null);
	};

	const handleClientUpdate = (updatedClient: Clients) => {
		// Update the clients list with the updated client
		if (clients) {
			setClients(
				(prevClients) =>
					prevClients?.map((client) =>
						client.id === updatedClient.id ? updatedClient : client,
					) || [],
			);
		}

		// Also update the selected client if it's the same one
		if (selectedClient && selectedClient.id === updatedClient.id) {
			setSelectedClient(updatedClient);
		}
	};

	const handleDeleteClient = (client: Clients) => {
		setSelectedClient(client);
		setShowDeleteModal(true);
	};

	const confirmDeleteClient = useCallback(async (client: Clients) => {
		try {
			const response = await fetch(`/api/clients?clientId=${client.id}`, {
				method: "DELETE",
				body: JSON.stringify({ clientId: client.id }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				toast.success("Client deleted successfully");
				fetchClients();
				setShowDeleteModal(false);
				setSelectedClient(null);
			}
		} catch (error) {
			toast.error("Failed to delete client");
		}
	}, []);

	useEffect(() => {
		fetchClients();
	}, [page]);

	const fetchClients = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await fetch(`/api/clients?page=${page}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setClients(data.clients);
			}
		} catch (error) {
			toast.error("Failed to fetch clients");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const columns: ColumnDef<Clients>[] = [
		{
			header: "Name",
			accessorKey: "name",
		},
		{
			header: "Email",
			accessorKey: "email",
		},

		{
			header: "Company",
			accessorKey: "company",
		},

		{
			header: "City",
			accessorKey: "city",
		},

		{
			header: "Country",
			accessorKey: "country",
		},
		{
			header: "Created At",
			accessorKey: "createdAt",
		},
		{
			header: "Updated At",
			accessorKey: "updatedAt",
		},
		{
			header: "Actions",
			accessorKey: "actions",
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleViewDetails(row.original)}>
							<Eye className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => copyToClipboard(row.original.email)}>
							<Copy className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleEditClient(row.original)}>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => handleDeleteClient(row.original)}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<>
			<Card className="w-full shadow-none rounded-none border-0 bg-accent">
				<CardContent className="px-5 sm:px-6 py-4 sm:py-3 flex items-center justify-between">
					<nav className="flex items-center space-x-1 text-sm text-muted-foreground">
						<Link
							href="/dashboard"
							className="flex items-center hover:text-foreground transition-colors">
							<Home className="h-4 w-4 mr-1" />
							Dashboard
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="flex items-center text-foreground">Invoices</span>
					</nav>
					<Button
						className="flex items-center gap-2"
						onClick={() => setShowAddModal(true)}>
						<Plus className="h-4 w-4" />
						Add New Client
					</Button>
				</CardContent>
			</Card>

			{isLoading ? (
				<Loading />
			) : (
				<>
					<div className=" mx-auto py-10 rounded-none">
						{clients && <DataTable columns={columns} data={clients} />}
						{totalPage !== 1 && (
							<div className="my-4">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious href="#" onClick={() => setPage(1)} />
										</PaginationItem>

										{new Array(totalPage)
											.fill(null)
											.map((item, index: number) => {
												return (
													<PaginationItem key={index}>
														<PaginationLink
															href="#"
															onClick={() => setPage(index + 1)}>
															{index + 1}
														</PaginationLink>
													</PaginationItem>
												);
											})}

										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={() => setPage(totalPage)}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</div>
				</>
			)}
			{/* Client Details Modal */}
			{selectedClient && (
				<ClientDetailsModal
					client={selectedClient}
					isOpen={showDetailsModal}
					onClose={handleCloseDetails}
				/>
			)}

			{showEditModal && selectedClient && (
				<ClientEditModal
					client={selectedClient}
					isOpen={showEditModal}
					onClose={handleCloseEdit}
					onUpdate={handleClientUpdate}
				/>
			)}

			<AddClientModel
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={() => {}}
			/>
			{showDeleteModal && selectedClient && (
				<AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								client and remove their data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setShowDeleteModal(false)}>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => confirmDeleteClient(selectedClient)}>
								Delete Client
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	);
}
