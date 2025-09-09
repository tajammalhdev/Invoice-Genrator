import { useState } from "react";
import CompanyForm from "./settings/CompanyForm";
import InvoicingForm from "./settings/InvoicingForm";
import PreferencesForm from "./settings/PreferencesForm";

export interface FormProps {
	data?: any;
}
const forms: {
	[key: string]: (props: FormProps) => React.ReactElement;
} = {
	company_details: (props) => <CompanyForm data={props.data} />,
	preferences: (props) => <PreferencesForm data={props.data} />,
	invoicing: (props) => <InvoicingForm data={props.data} />,
};

const SettingForm = ({
	data,
	relatedData,
}: FormProps & { relatedData?: any }) => {
	const [activeForm, setActiveForm] = useState("company_details");

	return (
		<>
			<aside className="border-border hidden w-64 h-full  py-6 pr-6 md:block">
				<ul className="-ml-3 space-y-1">
					{Object.entries(forms).map(([key, Form]) => (
						<li
							key={key}
							onClick={() => setActiveForm(key)}
							className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium ${
								activeForm === key
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground hover:bg-accent-foreground/10"
							}`}>
							<a>
								{key
									.replace("_", " ")
									.replace(/\b\w/g, (char) => char.toUpperCase())}
							</a>
						</li>
					))}
				</ul>
			</aside>
			<div className="flex-1">
				<div className="container mx-auto px-0 py-4 md:py-6 md:pl-6">
					{forms[activeForm]({ data })}
				</div>
			</div>
		</>
	);
};

export default SettingForm;
