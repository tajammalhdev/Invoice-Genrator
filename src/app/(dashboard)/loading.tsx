const Loading = () => {
	return (
		<div className="p-8 animate-pulse">
			<div className=" rounded-lg overflow-hidden shadow-md">
				<div className="p-8 bg-foreground-200 flex space-x-32">
					<div className="h-6 bg-accent rounded w-1/6"></div>
					<div className="h-6 bg-accent rounded w-2/6"></div>
					<div className="h-6 bg-accent rounded w-1/6"></div>
					<div className="h-6 bg-accent rounded w-1/6"></div>
				</div>
				<div className="p-4">
					{[...Array(10)].map((_, index) => (
						<div
							key={index}
							className="flex items-center justify-between mb-4 py-2 mt-4">
							<div className="h-8 bg-accent rounded w-1/6 mr-2"></div>
							<div className="h-8 bg-accent rounded w-2/6 mr-2"></div>
							<div className="h-8 bg-accent rounded w-1/6 mr-2"></div>
							<div className="h-8 bg-accent rounded w-1/6"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Loading;
