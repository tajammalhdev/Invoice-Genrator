import {
	calculateTax,
	DATE_OPTIONS,
	formatNumberWithCommas,
} from "@/lib/utils";
import InvoiceLayout from "./InvoiceLayout";

const InvoiceTemplate3 = ({ data }: { data: any }) => {
	const { settings, invoice } = data;

	return (
		<InvoiceLayout data={data}>
			{/* Header */}
			<div className="flex justify-between items-start border-b-4 border-gray-900 pb-8 mb-10">
				{/* Left: Logo + Sender Info */}
				<div className="flex items-start gap-6 flex-col">
					{settings?.logoUrl && (
						<div className=" p-3 rounded-lg">
							<img
								src={settings.logoUrl}
								width={120}
								height={80}
								alt={`Logo of ${settings.companyName}`}
								className="object-contain"
							/>
						</div>
					)}
					<div className="leading-relaxed">
						<h2 className="text-xl font-bold text-gray-900 tracking-wide">
							{settings?.companyName || "Sender Company Name"}
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							123 Placeholder Street <br />
							Placeholder City, 00000 <br />
							Placeholder Country <br />
							Email: sender@example.com <br />
							Phone: +1 234 567 890
						</p>
					</div>
				</div>

				{/* Right: Invoice Info + Client */}
				<div className="text-right">
					<h2 className="text-4xl font-extrabold text-indigo-600 tracking-wide">
						INVOICE
					</h2>
					<p className="mt-1 text-sm text-gray-500">#{invoice.number}</p>
					<address className="mt-6 not-italic text-gray-700 leading-relaxed">
						<strong className="block text-gray-900 text-base">
							{invoice.client.name}
						</strong>
						{invoice.client.address && (
							<span>
								{invoice.client.address}
								<br />
							</span>
						)}
						{invoice.client.zipCode && invoice.client.city && (
							<span>
								{invoice.client.zipCode}, {invoice.client.city}
								<br />
							</span>
						)}
						{invoice.client.country}
					</address>
				</div>
			</div>

			{/* Dates & Billing */}
			<div className="grid sm:grid-cols-2 gap-10 mb-10">
				<div>
					<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
						Bill To
					</h3>
					<p className="mt-2 text-gray-900 font-medium">
						{invoice.client.name}
					</p>
					<address className="mt-1 text-sm not-italic text-gray-600 leading-relaxed">
						{invoice.client.address && (
							<span>
								{invoice.client.address}
								<br />
							</span>
						)}
						{invoice.client.zipCode && invoice.client.city && (
							<span>
								{invoice.client.zipCode}, {invoice.client.city}
								<br />
							</span>
						)}
						{invoice.client.country}
					</address>
				</div>
				<div className="sm:text-right space-y-3">
					<dl className="flex justify-between sm:justify-end sm:gap-10">
						<dt className="font-semibold text-gray-600">Invoice Date:</dt>
						<dd className="text-gray-900">
							{new Date(invoice.invoiceDate).toLocaleDateString(
								"en-US",
								DATE_OPTIONS,
							)}
						</dd>
					</dl>
					<dl className="flex justify-between sm:justify-end sm:gap-10">
						<dt className="font-semibold text-gray-600">Due Date:</dt>
						<dd className="text-gray-900">
							{new Date(invoice.dueDate).toLocaleDateString(
								"en-US",
								DATE_OPTIONS,
							)}
						</dd>
					</dl>
				</div>
			</div>

			{/* Items Table */}
			<div className="overflow-hidden border border-gray-200 rounded-lg shadow-md">
				<table className="w-full text-sm">
					<thead className="bg-indigo-50 text-indigo-700 uppercase text-xs tracking-wider">
						<tr>
							<th className="py-3 px-4 text-left">Item</th>
							<th className="py-3 px-4 text-center">Qty</th>
							<th className="py-3 px-4 text-center">Rate</th>
							<th className="py-3 px-4 text-right">Amount</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{invoice.items.map((item: any, index: number) => (
							<tr
								key={index}
								className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
								<td className="py-3 px-4">
									<p className="font-medium text-gray-900">{item.name}</p>
									{item.description && (
										<p className="text-xs text-gray-500 mt-1">
											{item.description}
										</p>
									)}
								</td>
								<td className="py-3 px-4 text-center text-gray-700">
									{item.quantity}
								</td>
								<td className="py-3 px-4 text-center text-gray-700">
									{item.unitPrice} {settings.currency}
								</td>
								<td className="py-3 px-4 text-right text-gray-900 font-semibold">
									{item.total} {settings.currency}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Totals */}
			<div className="mt-10 flex justify-end">
				<div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md space-y-3">
					<dl className="flex justify-between">
						<dt className="font-medium text-gray-700">Subtotal:</dt>
						<dd className="text-gray-900">
							{formatNumberWithCommas(Number(invoice.subtotal))}{" "}
							{settings.currency}
						</dd>
					</dl>
					{invoice?.discount !== undefined && invoice.discount > 0 && (
						<dl className="flex justify-between">
							<dt className="font-medium text-gray-700">Discount:</dt>
							<dd className="text-red-500 font-medium">
								- {invoice.discount} {settings.currency}
							</dd>
						</dl>
					)}
					{settings.taxRate !== undefined && settings.taxRate > 0 && (
						<dl className="flex justify-between">
							<dt className="font-medium text-gray-700">Tax:</dt>
							<dd className="text-gray-900">
								+ {calculateTax(invoice.subtotal, settings.taxRate)}{" "}
								{settings.currency}
							</dd>
						</dl>
					)}
					<dl className="flex justify-between border-t pt-4">
						<dt className="text-lg font-bold text-gray-900">Total:</dt>
						<dd className="text-lg font-bold text-indigo-600">
							{formatNumberWithCommas(Number(invoice.total))}{" "}
							{settings.currency}
						</dd>
					</dl>
				</div>
			</div>

			{/* Footer Note */}
			<div className="mt-12 border-t pt-6 text-center text-xs text-gray-500 italic">
				<p>Thank you for your business — we appreciate your trust.</p>
				<p>Please make payment by the due date.</p>
			</div>
		</InvoiceLayout>
	);
};

export default InvoiceTemplate3;
