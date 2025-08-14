export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex  items-center justify-center h-screen px-4 w-full">
			{children}
		</div>
	);
}
