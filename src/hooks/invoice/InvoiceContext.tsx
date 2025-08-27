"use client";

import React, { createContext, useContext, useEffect } from "react";
import { atom, useAtom, useSetAtom } from "jotai";

interface Client {
	id: string;
	name: string;
	email: string;
	company?: string;
}

interface CompanySettings {
	taxRate: number;
	currencyCode: string;
	invoicePrefix: string;
}

// Atoms
const clientsAtom = atom<Client[]>([]);
const companySettingsAtom = atom<CompanySettings | null>(null);
const isLoadingClientsAtom = atom(false);
const isLoadingSettingsAtom = atom(false);
const discountTypeAtom = atom<string>("percentage");

interface InvoiceContextType {
	clients: Client[];
	companySettings: CompanySettings | null;
	isLoadingClients: boolean;
	isLoadingSettings: boolean;
	fetchClients: () => Promise<void>;
	fetchCompanySettings: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
	const [clients, setClients] = useAtom(clientsAtom);
	const [companySettings, setCompanySettings] = useAtom(companySettingsAtom);
	const [isLoadingClients, setIsLoadingClients] = useAtom(isLoadingClientsAtom);
	const [isLoadingSettings, setIsLoadingSettings] = useAtom(
		isLoadingSettingsAtom,
	);

	const fetchClients = async () => {
		setIsLoadingClients(true);
		try {
			const response = await fetch("/api/clients");
			if (response.ok) {
				const data = await response.json();
				setClients(data.clients || []);
			}
		} catch (error) {
			console.error("Failed to fetch clients:", error);
		} finally {
			setIsLoadingClients(false);
		}
	};

	const fetchCompanySettings = async () => {
		setIsLoadingSettings(true);
		try {
			const response = await fetch("/api/settings");
			if (response.ok) {
				const data = await response.json();
				setCompanySettings(data);
			}
		} catch (error) {
			console.error("Failed to fetch settings:", error);
		} finally {
			setIsLoadingSettings(false);
		}
	};

	useEffect(() => {
		fetchClients();
		fetchCompanySettings();
	}, []);

	return (
		<InvoiceContext.Provider
			value={{
				clients,
				companySettings,
				isLoadingClients,
				isLoadingSettings,
				fetchClients,
				fetchCompanySettings,
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

// Direct atom hooks for more granular control
export function useClients() {
	return useAtom(clientsAtom);
}

export function useCompanySettings() {
	return useAtom(companySettingsAtom);
}

export function useIsLoadingClients() {
	return useAtom(isLoadingClientsAtom);
}

export function useIsLoadingSettings() {
	return useAtom(isLoadingSettingsAtom);
}

export { discountTypeAtom };
