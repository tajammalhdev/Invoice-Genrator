import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Eye, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard } from "@/lib/utils";
import { Building2, Mail, Phone } from "lucide-react";
import { Clients } from "@/lib/zodSchemas";
import { useState } from "react";
import ClientDetails from "./ClientDetails";
import ClientEditModal from "./ClientEditModal";

export default function ClientsContent({ clients }: { clients: Clients[] }) {
	const [selectedClient, setSelectedClient] = useState<Clients | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

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

	return (
		<>
			<Card className="mt-7 shadow-none">
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
												{client.name.charAt(0).toUpperCase()}
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
												<DropdownMenuItem
													onClick={() => handleViewDetails(client)}>
													<Eye className="h-4 w-4 mr-2" />
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleEditClient(client)}>
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

			{/* Client Details Modal */}
			{selectedClient && (
				<ClientDetails
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
				/>
			)}
		</>
	);
}
