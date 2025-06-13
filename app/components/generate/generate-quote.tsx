import { Card, CardTitle } from "@/components/ui/card";

import { LanguageContext } from "@/app/language-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type FormSchema, formSchema } from "../schemas";
import { GeneralForm } from "./general-form";
import { VehicleForm } from "./vehicle-form";

export default function GenerateQuote() {
	const translation = useContext(LanguageContext);

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
	});

	console.log(form.formState.errors);

	const onSubmit = (data: FormSchema) => {
		alert("onSubmit called!");
		console.log(data);
	};

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
					<Button type="submit" variant={"default"}>
						Submit
					</Button>
				</form>
			</FormProvider>
		</Card>
	);
}
