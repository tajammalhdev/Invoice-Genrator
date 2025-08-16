import { Clients } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Mail, Phone, MapPin, Calendar, Copy } from "lucide-react";
import { copyToClipboard, formatDate } from "@/lib/utils";

type ClientDetailsProps = {
	client: Clients;
	isOpen: boolean;
	onClose: () => void;
};

export default function ClientDetailsModal({
	client,
	isOpen,
	onClose,
}: ClientDetailsProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-[90vw] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl">Client Details</DialogTitle>
					<p className="text-muted-foreground">
						View complete client information
					</p>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
									<span className="text-primary font-semibold text-lg">
										{client.name.charAt(0).toUpperCase()}
									</span>
								</div>
								<div>
									<h3 className="text-xl font-semibold">{client.name}</h3>
									{client.company && (
										<p className="text-muted-foreground text-sm">
											{client.company}
										</p>
									)}
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Contact Information */}
							<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
								<div className="flex items-center gap-3">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm text-muted-foreground">Email</p>
										<div className="flex items-center gap-2">
											<p className="font-medium">{client.email}</p>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => copyToClipboard(client.email)}
												className="h-6 w-6 p-0">
												<Copy className="h-3 w-3" />
											</Button>
										</div>
									</div>
								</div>

								{client.phone && (
									<div className="flex items-center gap-3">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<div>
											<p className="text-sm text-muted-foreground">Phone</p>
											<p className="font-medium">{client.phone}</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Address Information */}
					{(client.address ||
						client.city ||
						client.state ||
						client.postalCode ||
						client.country) && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="h-5 w-5" />
									Address Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{client.address && (
										<div>
											<p className="text-sm text-muted-foreground">
												Street Address
											</p>
											<p className="font-medium">{client.address}</p>
										</div>
									)}

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										{client.city && (
											<div>
												<p className="text-sm text-muted-foreground">City</p>
												<p className="font-medium">{client.city}</p>
											</div>
										)}

										{client.state && (
											<div>
												<p className="text-sm text-muted-foreground">
													State/Province
												</p>
												<p className="font-medium">{client.state}</p>
											</div>
										)}

										{client.postalCode && (
											<div>
												<p className="text-sm text-muted-foreground">
													Postal Code
												</p>
												<p className="font-medium">{client.postalCode}</p>
											</div>
										)}
									</div>

									{client.country && (
										<div>
											<p className="text-sm text-muted-foreground">Country</p>
											<p className="font-medium">{client.country}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Additional Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Additional Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{client.id && (
									<div>
										<p className="text-sm text-muted-foreground">Client ID</p>
										<Badge variant="outline" className="font-mono text-xs">
											{client.id}
										</Badge>
									</div>
								)}
								{client.createdAt && (
									<div>
										<p className="text-sm text-muted-foreground">Created</p>
										<p className="font-medium">
											{formatDate(client.createdAt)}
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
