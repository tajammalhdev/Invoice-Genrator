import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useSettings } from "@/app/contexts/SettingsContext";

interface UseSettingsFormOptions<T> {
	action: (prevState: any, formData: FormData) => Promise<any>;
	onSuccess?: (data: T) => void;
	onError?: (error: string) => void;
	successMessage?: string;
	errorMessage?: string;
}

export function useSettingsForm<T>({
	action,
	onSuccess,
	onError,
	successMessage = "Settings updated successfully!",
	errorMessage = "Failed to update settings",
}: UseSettingsFormOptions<T>) {
	const { updateSettings, updateSettingsOptimistically } = useSettings();
	const [state, formAction] = useActionState(action, undefined);

	useEffect(() => {
		if (state && "success" in state && state.success) {
			toast.success(successMessage);
			
			// Update context with new data
			if (state.data) {
				updateSettings(state.data);
			}
			
			// Call custom success handler
			if (onSuccess && state.data) {
				onSuccess(state.data);
			}
		} else if (state && "error" in state && state.error) {
			const errorMsg = state.error as string;
			toast.error(errorMsg || errorMessage);
			
			// Call custom error handler
			if (onError) {
				onError(errorMsg);
			}
		}
	}, [state, updateSettings, onSuccess, onError, successMessage, errorMessage]);

	const handleSubmit = async (formData: FormData) => {
		// Extract form data for optimistic updates
		const formDataObj: Record<string, any> = {};
		for (const [key, value] of formData.entries()) {
			formDataObj[key] = value;
		}

		// Apply optimistic update
		updateSettingsOptimistically(formDataObj);

		// Submit to server
		formAction(formData);
	};

	return {
		state,
		formAction: handleSubmit,
		isSubmitting: state && "success" in state ? false : true,
	};
}
