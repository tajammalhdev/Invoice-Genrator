/**
 * Dynamically imports and retrieves an invoice template React component based on the provided template ID.
 *
 * @param {number} templateId - The ID of the invoice template.
 * @returns {Promise<React.ComponentType<any> | null>} A promise that resolves to the invoice template component or null if not found.
 * @throws {Error} Throws an error if there is an issue with the dynamic import or if a default template is not available.
 */
const getInvoiceTemplate = async (templateId: number) => {
	const componentName = `InvoiceTemplate${templateId}`;
	console.log(`Dynamically loading template: ${componentName}`);

	try {
		// Use dynamic import with proper path resolution
		const module = await import(
			`@/app/components/templates/invoice-pdf/${componentName}`
		);

		console.log(`Successfully loaded ${componentName}`);
		console.log(`Template type:`, typeof module.default);

		return module.default;
	} catch (error) {
		console.error(`Failed to load template ${componentName}:`, error);

		// Fallback: try to load template 1 if the requested template fails
		if (templateId !== 1) {
			console.log(`Falling back to InvoiceTemplate1`);
			try {
				const fallbackModule = await import(
					`@/app/components/templates/invoice-pdf/InvoiceTemplate1`
				);
				return fallbackModule.default;
			} catch (fallbackError) {
				console.error(`Fallback template also failed:`, fallbackError);
			}
		}

		return null;
	}
};

export { getInvoiceTemplate };
