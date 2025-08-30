"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useCallback,
} from "react";
import { atom, useAtom } from "jotai";
import { Invoice, Setting, Client } from "@prisma/client";

// Simplified interfaces

// Consolidated atoms
const clientsAtom = atom<Client[]>([]);
const companySettingsAtom = atom<Setting | null>(null);
const invoicesAtom = atom<Invoice[]>([]);
const loadingAtom = atom({
	clients: false,
	settings: false,
	invoices: false,
});
const discountTypeAtom = atom<string>("percentage");

interface InvoiceContextType {
	// Data
	clients: Client[];
	companySettings: Setting | null;
	invoices: Invoice[];

	// Loading states
	loading: {
		clients: boolean;
		settings: boolean;
		invoices: boolean;
	};

	// Actions
	fetchData: () => Promise<void>;
	refreshInvoices: () => Promise<void>;

	// Queries
	getInvoiceById: (id: string) => Invoice | undefined;
	getInvoicesByStatus: (status: string) => Invoice[];
	getInvoicesByClient: (clientId: string) => Invoice[];
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
	const [clients, setClients] = useAtom(clientsAtom);
	const [companySettings, setCompanySettings] = useAtom(companySettingsAtom);
	const [invoices, setInvoices] = useAtom(invoicesAtom);
	const [loading, setLoading] = useAtom(loadingAtom);

	// Generic fetch function to reduce duplication
	const fetchData = useCallback(
		async (
			endpoint: string,
			setter: (data: any) => void,
			key: keyof typeof loading,
		) => {
			setLoading((prev) => ({ ...prev, [key]: true }));
			try {
				const response = await fetch(endpoint);
				if (response.ok) {
					const data = await response.json();
					// Handle different response structures
					const finalData = data.clients || data;
					setter(finalData);
				}
			} catch (error) {
				console.error(`Failed to fetch ${key}:`, error);
			} finally {
				setLoading((prev) => ({ ...prev, [key]: false }));
			}
		},
		[setLoading],
	);

	// Specific fetch functions using the generic one
	const fetchClients = useCallback(
		() => fetchData("/api/clients", setClients, "clients"),
		[fetchData],
	);

	const fetchCompanySettings = useCallback(
		() => fetchData("/api/settings", setCompanySettings, "settings"),
		[fetchData],
	);

	const fetchInvoices = useCallback(
		() => fetchData("/api/invoices", setInvoices, "invoices"),
		[fetchData],
	);

	// Consolidated fetch all data
	const fetchAllData = useCallback(async () => {
		await Promise.all([
			fetchClients(),
			fetchCompanySettings(),
			fetchInvoices(),
		]);
	}, [fetchClients, fetchCompanySettings, fetchInvoices]);

	// Convenience functions
	const refreshInvoices = useCallback(() => fetchInvoices(), [fetchInvoices]);

	const getInvoiceById = useCallback(
		(id: string) => invoices.find((invoice) => invoice.id === id),
		[invoices],
	);

	const getInvoicesByStatus = useCallback(
		(status: string) => invoices.filter((invoice) => invoice.status === status),
		[invoices],
	);

	const getInvoicesByClient = useCallback(
		(clientId: string) =>
			invoices.filter((invoice) => invoice.clientId === clientId),
		[invoices],
	);

	// Initialize data on mount
	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	return (
		<InvoiceContext.Provider
			value={{
				clients,
				companySettings,
				invoices,
				loading,
				fetchData: fetchAllData,
				refreshInvoices,
				getInvoiceById,
				getInvoicesByStatus,
				getInvoicesByClient,
			}}>
			{children}
		</InvoiceContext.Provider>
	);
}

export function useInvoiceContext() {
	const context = useContext(InvoiceContext);
	if (!context) {
		throw new Error("useInvoiceContext must be used within InvoiceProvider");
	}
	return context;
}

// Simplified direct hooks
export function useClients() {
	return useAtom(clientsAtom);
}

export function useCompanySettings() {
	return useAtom(companySettingsAtom);
}

export function useInvoices() {
	return useAtom(invoicesAtom);
}

export function useLoading() {
	return useAtom(loadingAtom);
}

export { discountTypeAtom };
