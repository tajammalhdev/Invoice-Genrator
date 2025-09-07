export default function DateInput({
	name,
	register,
	setCustomValue,
	defaultValue,
	error,
}: {
	name: string;
	register: any;
	setCustomValue: (id: string, value: any) => void;
	defaultValue: string;
	error?: string;
}) {
	return (
		<input
			type="date"
			{...register(name)}
			defaultValue={defaultValue}
			className="w-full py-2 px-3 rounded-md text-sm disabled:opacity-75 disabled:cursor-not-allowed border border-gray-300"
			onChange={(e) => setCustomValue(name, e.target.value)}
		/>
	);
}
