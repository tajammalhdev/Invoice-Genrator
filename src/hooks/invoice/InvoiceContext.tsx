"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import { atom, useAtom } from "jotai";
import { Invoice, Setting, Client, InvoiceStatus } from "@prisma/client";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface InvoiceContextState {
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

	// Editing states
	isEditing: boolean;
	invoiceToEdit: Invoice | null;
}

export interface InvoiceContextActions {
	// Data fetching
	fetchData: () => Promise<void>;
	refreshClients: () => Promise<void>;
	refreshSettings: () => Promise<void>;
	refreshInvoices: () => Promise<void>;

	// Queries
	getInvoiceById: (id: string) => Invoice | undefined;
	getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
	getInvoicesByClient: (clientId: string) => Invoice[];
	getInvoicesByDateRange: (startDate: Date, endDate: Date) => Invoice[];

	// Statistics
	getInvoiceStats: () => {
		total: number;
		draft: number;
		pending: number;
		paid: number;
		overdue: number;
		totalAmount: number;
		paidAmount: number;
		overdueAmount: number;
	};
}

export interface InvoiceContextType
	extends InvoiceContextState,
		InvoiceContextActions {}

export interface InvoiceActions {
	isEditing: boolean;
	invoiceToEdit: Invoice | null;
	setInvoiceToEdit: (invoice: Invoice | null) => void;
	clearEditing: () => void;

	// Email dialog actions
	selectedInvoice: Invoice | null;
	isEmailDialogOpen: boolean;
	openEmailDialog: (invoice: Invoice) => void;
	closeEmailDialog: () => void;

	// PDF actions
	downloadInvoicePDF: (invoice: Invoice) => void;
}

// ============================================================================
// ATOMS
// ============================================================================

const clientsAtom = atom<Client[]>([]);
const companySettingsAtom = atom<Setting | null>(null);
const invoicesAtom = atom<Invoice[]>([]);
const loadingAtom = atom({
	clients: false,
	settings: false,
	invoices: false,
});
const discountTypeAtom = atom<string>("percentage");

// Editing state atoms
const isEditingAtom = atom<boolean>(false);
const invoiceToEditAtom = atom<Invoice | null>(null);

// Email dialog state atoms
const selectedInvoiceAtom = atom<Invoice | null>(null);
const isEmailDialogOpenAtom = atom<boolean>(false);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateInvoiceStats = (invoices: Invoice[]) => {
	const now = new Date();

	return invoices.reduce(
		(acc, invoice) => {
			acc.total++;
			acc.totalAmount += invoice.total;

			switch (invoice.status) {
				case "DRAFT":
					acc.draft++;
					break;
				case "PENDING":
					acc.pending++;
					if (invoice.dueDate < now) {
						acc.overdue++;
						acc.overdueAmount += invoice.total;
					}
					break;
				case "PAID":
					acc.paid++;
					acc.paidAmount += invoice.paidTotal;
					break;
				case "OVERDUE":
					acc.overdue++;
					acc.overdueAmount += invoice.total;
					break;
			}

			return acc;
		},
		{
			total: 0,
			draft: 0,
			pending: 0,
			paid: 0,
			overdue: 0,
			totalAmount: 0,
			paidAmount: 0,
			overdueAmount: 0,
		},
	);
};

// ============================================================================
// CONTEXT
// ============================================================================

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
	const [clients, setClients] = useAtom(clientsAtom);
	const [companySettings, setCompanySettings] = useAtom(companySettingsAtom);
	const [invoices, setInvoices] = useAtom(invoicesAtom);
	const [loading, setLoading] = useAtom(loadingAtom);
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [invoiceToEdit, setInvoiceToEdit] = useAtom(invoiceToEditAtom);

	// ============================================================================
	// DATA FETCHING
	// ============================================================================

	const fetchData = useCallback(
		async (
			endpoint: string,
			setter: (data: any) => void,
			key: keyof typeof loading,
		) => {
			setLoading((prev) => ({ ...prev, [key]: true }));

			try {
				const response = await fetch(endpoint);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				const finalData = key === "settings" ? data : data.clients || data;
				setter(finalData);
			} catch (error) {
				console.error(`Failed to fetch ${key}:`, error);
				// In a production app, you might want to show a toast notification here
				throw error;
			} finally {
				setLoading((prev) => ({ ...prev, [key]: false }));
			}
		},
		[setLoading],
	);

	const fetchClients = useCallback(
		() => fetchData("/api/clients", setClients, "clients"),
		[fetchData, setClients],
	);

	const fetchCompanySettings = useCallback(
		() => fetchData("/api/settings", setCompanySettings, "settings"),
		[fetchData, setCompanySettings],
	);

	const fetchInvoices = useCallback(
		() => fetchData("/api/invoices", setInvoices, "invoices"),
		[fetchData, setInvoices],
	);

	const fetchAllData = useCallback(async () => {
		try {
			await Promise.all([
				fetchClients(),
				fetchCompanySettings(),
				fetchInvoices(),
			]);
		} catch (error) {
			console.error("Failed to fetch initial data:", error);
		}
	}, [fetchClients, fetchCompanySettings, fetchInvoices]);

	// ============================================================================
	// QUERIES
	// ============================================================================

	const getInvoiceById = useCallback(
		(id: string) => invoices.find((invoice) => invoice.id === id),
		[invoices],
	);

	const getInvoicesByStatus = useCallback(
		(status: InvoiceStatus) =>
			invoices.filter((invoice) => invoice.status === status),
		[invoices],
	);

	const getInvoicesByClient = useCallback(
		(clientId: string) =>
			invoices.filter((invoice) => invoice.clientId === clientId),
		[invoices],
	);

	const getInvoicesByDateRange = useCallback(
		(startDate: Date, endDate: Date) =>
			invoices.filter(
				(invoice) =>
					invoice.issueDate >= startDate && invoice.issueDate <= endDate,
			),
		[invoices],
	);

	// ============================================================================
	// STATISTICS
	// ============================================================================

	const getInvoiceStats = useCallback(() => {
		return calculateInvoiceStats(invoices);
	}, [invoices]);

	// ============================================================================
	// MEMOIZED VALUES
	// ============================================================================

	const contextValue = useMemo<InvoiceContextType>(
		() => ({
			// State
			clients,
			companySettings,
			invoices,
			loading,
			isEditing,
			invoiceToEdit,

			// Actions
			fetchData: fetchAllData,
			refreshClients: fetchClients,
			refreshSettings: fetchCompanySettings,
			refreshInvoices: fetchInvoices,

			// Queries
			getInvoiceById,
			getInvoicesByStatus,
			getInvoicesByClient,
			getInvoicesByDateRange,

			// Statistics
			getInvoiceStats,
		}),
		[
			clients,
			companySettings,
			invoices,
			loading,
			isEditing,
			invoiceToEdit,
			fetchAllData,
			fetchClients,
			fetchCompanySettings,
			fetchInvoices,
			getInvoiceById,
			getInvoicesByStatus,
			getInvoicesByClient,
			getInvoicesByDateRange,
			getInvoiceStats,
		],
	);

	// ============================================================================
	// EFFECTS
	// ============================================================================

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	// ============================================================================
	// RENDER
	// ============================================================================

	return (
		<InvoiceContext.Provider value={contextValue}>
			{children}
		</InvoiceContext.Provider>
	);
}

// ============================================================================
// HOOKS
// ============================================================================

export function useInvoiceContext(): InvoiceContextType {
	const context = useContext(InvoiceContext);
	if (!context) {
		throw new Error("useInvoiceContext must be used within InvoiceProvider");
	}
	return context;
}

// Direct atom hooks for performance
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

export function useIsEditing() {
	return useAtom(isEditingAtom);
}

export function useInvoiceToEdit() {
	return useAtom(invoiceToEditAtom);
}

// Professional invoice actions hook
export function useInvoiceActions(): InvoiceActions {
	const [isEditing, setIsEditing] = useAtom(isEditingAtom);
	const [invoiceToEdit, setInvoiceToEdit] = useAtom(invoiceToEditAtom);
	const [selectedInvoice, setSelectedInvoice] = useAtom(selectedInvoiceAtom);
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useAtom(
		isEmailDialogOpenAtom,
	);
	const [companySettings] = useAtom(companySettingsAtom);

	const setInvoiceToEditWithState = useCallback(
		(invoice: Invoice | null) => {
			setInvoiceToEdit(invoice);
			setIsEditing(!!invoice);
		},
		[setInvoiceToEdit, setIsEditing],
	);

	const clearEditing = useCallback(() => {
		setInvoiceToEdit(null);
		setIsEditing(false);
	}, [setInvoiceToEdit, setIsEditing]);

	const openEmailDialog = useCallback(
		(invoice: Invoice) => {
			setSelectedInvoice(invoice);
			setIsEmailDialogOpen(true);
		},
		[setSelectedInvoice, setIsEmailDialogOpen],
	);

	const closeEmailDialog = useCallback(() => {
		setSelectedInvoice(null);
		setIsEmailDialogOpen(false);
	}, [setSelectedInvoice, setIsEmailDialogOpen]);

	const downloadInvoicePDF = useCallback(
		(invoice: Invoice) => {
			// Import the PDF generator function
			import("@/lib/pdfGenerator").then(
				({ downloadInvoicePDF: pdfDownload }) => {
					pdfDownload(invoice as any, companySettings);
				},
			);
		},
		[companySettings],
	);

	return {
		isEditing,
		invoiceToEdit,
		setInvoiceToEdit: setInvoiceToEditWithState,
		clearEditing,
		selectedInvoice,
		isEmailDialogOpen,
		openEmailDialog,
		closeEmailDialog,
		downloadInvoicePDF,
	};
}

// Email dialog hook
export function useEmailDialog() {
	const [selectedInvoice, setSelectedInvoice] = useAtom(selectedInvoiceAtom);
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useAtom(
		isEmailDialogOpenAtom,
	);

	const openEmailDialog = useCallback(
		(invoice: Invoice) => {
			setSelectedInvoice(invoice);
			setIsEmailDialogOpen(true);
		},
		[setSelectedInvoice, setIsEmailDialogOpen],
	);

	const closeEmailDialog = useCallback(() => {
		setSelectedInvoice(null);
		setIsEmailDialogOpen(false);
	}, [setSelectedInvoice, setIsEmailDialogOpen]);

	return {
		selectedInvoice,
		isEmailDialogOpen,
		openEmailDialog,
		closeEmailDialog,
	};
}

// ============================================================================
// EXPORTS
// ============================================================================

export { discountTypeAtom };
