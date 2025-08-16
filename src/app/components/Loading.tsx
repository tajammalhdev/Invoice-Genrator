export default function Loading() {
	return (
		<div className="flex justify-center items-center min-h-24 flex-col gap-3">
			<div className="relative">
				{/* Outer circle */}
				<div className="w-8 h-8 border-2 border-muted rounded-full"></div>
				{/* Animated spinner */}
				<div className="absolute top-0 left-0 w-8 h-8 border-2 border-transparent border-t-foreground rounded-full animate-spin"></div>
			</div>
			{/* Loading text */}
			<p className="text-sm text-muted-foreground">Loading...</p>
		</div>
	);
}
