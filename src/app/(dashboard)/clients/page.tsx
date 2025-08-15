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

import { useCallback, useEffect, useState } from "react";
import AddClientModel from "../components/_clients/AddClientModel";
import type { Clients } from "@/lib/zodSchemas";
import { toast } from "sonner";
import ClientHeader from "../components/_clients/ClientHeader";
import ClientsContent from "../components/_clients/ClientsContent";

export default function Clients() {
	const [showAddModal, setShowAddModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [clients, setClients] = useState<Clients[] | null>(null);
	const [filteredClients, setFilteredClients] = useState<Clients[]>([]);
	const [page, setPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [totalPage, setTotalPage] = useState<number>(1);

	useEffect(() => {
		fetchClients();
	}, [page]);

	const fetchClients = useCallback(async () => {
		try {
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

	return (
		<div className="w-full h-full min-h-[calc(100vh-10rem)] px-4 py-6">
			<ClientHeader setShowAddModal={setShowAddModal} />

			{clients && <ClientsContent clients={clients} />}
			<AddClientModel
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSubmit={() => {}}
			/>
		</div>
	);
}
