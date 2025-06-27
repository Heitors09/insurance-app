import { Card, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { LanguageContext } from "@/app/language-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type FormSchema, formSchema } from "../schemas";
import { AlternativeOptionsForm } from "./alternative-options-form";
import { GeneralForm } from "./general-form";
import PaymentForm from "./payment-form";
import QuoteSummary from "./quote-summary";
import { VehicleForm } from "./vehicle-form";

export default function GenerateQuote() {
	const translation = useContext(LanguageContext);

	const form = useForm({
		resolver: zodResolver(formSchema),
	});

	const [quoteData, setQuoteData] = useState<FormSchema | null>(null);

	const onSubmit = (data: FormSchema) => {
		try {
			setQuoteData(data);
			toast.success("Quote generated successfully");
		} catch (error) {
			toast.error(`Error generating quote: ${error}`);
		}
	};

	if (quoteData) {
		return (
			<Card className="border-none bg-white w-[800px] text-slate-900 ring-1 ring-slate-200 px-8 flex flex-col items-center text-slate-900 rounded-[8px]">
				<QuoteSummary data={quoteData} />
			</Card>
		);
	}

	return (
		<Card className="border-none bg-white w-[800px] text-slate-900 ring-1 ring-slate-200 px-8 flex flex-col items-center text-slate-900 rounded-[8px]">
			<CardTitle className="text-xl">
				{translation?.translations.autoInsurance}
			</CardTitle>
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-4"
				>
					<GeneralForm />
					<Separator className="bg-slate-300" />
					<VehicleForm />
					<Separator className="bg-slate-300 mt-12" />
					<AlternativeOptionsForm />
					<Separator className="bg-slate-300 mt-12" />
					<PaymentForm />
					<Button
						type="submit"
						className="w-full py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-[8px] flex items-center justify-center gap-2"
					>
						<FileText size={20} />
						Generate Quote
					</Button>
				</form>
			</FormProvider>
		</Card>
	);
}
