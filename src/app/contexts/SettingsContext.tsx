"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from "react";
import { Settings } from "@/app/utils/zodSchemas";

interface SettingsContextType {
	settings: Settings | null;
	loading: boolean;
	error: string | null;
	updateSettings: (newSettings: Partial<Settings>) => void;
	updateSettingsOptimistically: (newSettings: Partial<Settings>) => void;
	refreshSettings: () => Promise<void>;
	clearError: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}

interface SettingsProviderProps {
	children: ReactNode;
	initialSettings: Settings;
}

export function SettingsProvider({
	children,
	initialSettings,
}: SettingsProviderProps) {
	const [settings, setSettings] = useState<Settings>(initialSettings);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateSettings = useCallback((newSettings: Partial<Settings>) => {
		setSettings((prev) => {
			if (!prev) return newSettings as Settings;
			return {
				...prev,
				...newSettings,
			};
		});
	}, []);

	const updateSettingsOptimistically = useCallback(
		(newSettings: Partial<Settings>) => {
			// Immediately update the UI for better UX
			updateSettings(newSettings);
		},
		[updateSettings],
	);

	const refreshSettings = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			// This would be called when you want to refresh from server
			// For now, we'll just simulate it
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to refresh settings",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const value: SettingsContextType = {
		settings,
		loading,
		error,
		updateSettings,
		updateSettingsOptimistically,
		refreshSettings,
		clearError,
	};

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}
