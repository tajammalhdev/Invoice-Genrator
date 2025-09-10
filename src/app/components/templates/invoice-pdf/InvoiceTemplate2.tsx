import {
	calculateTax,
	DATE_OPTIONS,
	formatNumberWithCommas,
} from "@/lib/utils";
import InvoiceLayout from "./InvoiceLayout";
import { Fragment } from "react";

const InvoiceTemplate2 = ({ data }: { data: any }) => {
	const { settings, invoice } = data;

	return (
		<InvoiceLayout data={data}>
			<style
				dangerouslySetInnerHTML={{
					__html: `
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                `,
				}}
			/>
			{/* Top header with logo and invoice info */}
			<div className="flex justify-between items-center border-b-2 border-gray-800 pb-6 mb-8">
				<div>
					<h1 className="text-4xl font-extrabold tracking-wide text-gray-900">
						INVOICE
					</h1>
					<p className="mt-2 text-gray-500 text-sm">#{invoice.number}</p>
				</div>
				{settings.invoiceLogo && (
					<img
						src={settings.invoiceLogo}
						alt={`Logo of ${settings.companyName}`}
						className="h-16 object-contain"
					/>
				)}
			</div>

			{/* Sender & Client info */}
			<div className="grid sm:grid-cols-2 gap-8 mb-10">
				{/* Sender (From) */}
				<div>
					<h3 className="text-sm font-semibold text-gray-500 uppercase">
						From
					</h3>
					<p className="mt-2 text-lg font-semibold text-gray-900">
						{settings.companyName || "Company Name"}
					</p>
					<address className="mt-1 not-italic text-sm leading-6 text-gray-600">
						{settings.companyAddress || "123 Business Street"} <br />
						{settings.companyZip || "00000"}, {settings.companyCity || "City"}{" "}
						<br />
						{settings.companyCountry || "Country"} <br />
						{settings.companyEmail || "email@company.com"} <br />
						{settings.companyPhone || "+1 (000) 000-0000"}
					</address>
				</div>

				{/* Client (Billed To) */}
				<div className="sm:text-right">
					<h3 className="text-sm font-semibold text-gray-500 uppercase">
						Billed To
					</h3>
					<p className="mt-2 text-lg font-semibold text-gray-900">
						{invoice.client.name}
					</p>
					<address className="mt-1 not-italic text-sm leading-6 text-gray-600">
						{invoice.client.address} <br />
						{invoice.client.zipCode}, {invoice.client.city} <br />
						{invoice.client.country}
					</address>
				</div>
			</div>

			{/* Invoice details */}
			<div className="mb-10">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Invoice Details
				</h3>
				<dl className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
					<div className="flex justify-between sm:justify-start sm:gap-4">
						<dt className="font-medium">Invoice Date:</dt>
						<dd>
							{new Date(invoice.issueDate).toLocaleDateString(
								"en-US",
								DATE_OPTIONS,
							)}
						</dd>
					</div>
					<div className="flex justify-between sm:justify-end sm:gap-4">
						<dt className="font-medium">Due Date:</dt>
						<dd>
							{new Date(invoice.dueDate).toLocaleDateString(
								"en-US",
								DATE_OPTIONS,
							)}
						</dd>
					</div>
				</dl>
			</div>

			{/* Items Table */}
			<div className="overflow-hidden rounded-lg border border-gray-200">
				<div className="grid grid-cols-5 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider">
					<div className="col-span-2 px-4 py-3">Item</div>
					<div className="px-4 py-3">Qty</div>
					<div className="px-4 py-3">Rate</div>
					<div className="px-4 py-3 text-right">Amount</div>
				</div>
				<div className="divide-y divide-gray-200">
					{invoice.items.map((item: any, index: number) => (
						<Fragment key={index}>
							<div
								className={`grid grid-cols-5 px-4 py-4 text-sm ${
									index % 2 === 0 ? "bg-white" : "bg-gray-50"
								}`}>
								<div className="col-span-2">
									<p className="font-medium text-gray-900">{item.name}</p>
									{item.description && (
										<p className="text-xs text-gray-600">{item.description}</p>
									)}
								</div>
								<div className="text-gray-700">{item.quantity}</div>
								<div className="text-gray-700">
									{item.unitPrice} {settings.currency}
								</div>
								<div className="text-right font-semibold text-gray-900">
									{item.total} {settings.currency}
								</div>
							</div>
						</Fragment>
					))}
				</div>
			</div>

			{/* Totals */}
			<div className="mt-8 sm:ml-auto sm:w-1/2">
				<dl className="space-y-3 text-sm">
					<div className="flex justify-between">
						<dt className="font-medium text-gray-700">Subtotal</dt>
						<dd className="text-gray-900">
							{formatNumberWithCommas(Number(invoice.subtotal))}{" "}
							{settings.currency}
						</dd>
					</div>
					{invoice.discount > 0 && (
						<div className="flex justify-between">
							<dt className="font-medium text-gray-700">Discount</dt>
							<dd className="text-red-600">
								- {invoice.discountAmount} {settings.currency}
							</dd>
						</div>
					)}
					{settings.taxRate > 0 && (
						<div className="flex justify-between">
							<dt className="font-medium text-gray-700">Tax</dt>
							<dd className="text-gray-900">
								+ {calculateTax(invoice.subtotal, settings.taxRate)}{" "}
								{settings.currency}
							</dd>
						</div>
					)}
				</dl>

				{/* Highlighted total bar */}
				<div className="mt-6 bg-gray-900 text-white rounded-lg px-6 py-4 flex justify-between items-center text-lg font-bold">
					<dt>Total</dt>
					<dd>
						{formatNumberWithCommas(Number(invoice.total))} {settings.currency}
					</dd>
				</div>
			</div>
		</InvoiceLayout>
	);
};

export default InvoiceTemplate2;
