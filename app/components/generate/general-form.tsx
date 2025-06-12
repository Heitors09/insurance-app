import { LanguageContext } from "@/app/language-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
} from "@/components/ui/select";
import { carriers, csrNames } from "@/lib/constants";
import { agentNames } from "@/lib/languages";
import { useContext } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FormSchema } from "../schemas";

export const GeneralForm = () => {
	const translation = useContext(LanguageContext);

	const { control } = useFormContext<FormSchema>();

	return (
		<>
			<Controller
				control={control}
				name={"type_of_insurance"}
				render={({ field, fieldState }) => (
					<Select value={field.value} onValueChange={field.onChange}>
						<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
							{field.value || translation?.translations.insuranceTypeLabel}
						</SelectTrigger>
						<SelectContent className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
							<SelectItem
								value={translation?.translations.autoInsuranceType || ""}
								className="hover:text-slate-900 text-slate-500"
							>
								{translation?.translations.autoInsuranceType}
							</SelectItem>
							<SelectSeparator className="bg-slate-300 mx-2" />
							<SelectItem
								value={
									translation?.translations.commercialAutoInsuranceType || ""
								}
								className="hover:text-slate-900 text-slate-500"
							>
								{translation?.translations.commercialAutoInsuranceType}
							</SelectItem>
						</SelectContent>
						{fieldState.error && (
							<p className="text-red-500 text-sm mt-1">
								{fieldState.error.message}
							</p>
						)}
					</Select>
				)}
			/>
			<div className="w-full flex gap-4">
				<div className="flex w-full gap-4">
					<div className="w-full space-y-4">
						<Label className="flex items-center" htmlFor="name">
							{translation?.translations.agentName}
							<span className="text-orange-500">*</span>
						</Label>
						<Controller
							name="agent_name"
							control={control}
							render={({ field, fieldState }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{field.value || translation?.translations.agentName}
									</SelectTrigger>
									<SelectContent className="w-[360px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
										{agentNames.map((agent, index) => (
											<SelectItem
												value={agent}
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												key={index}
												className="hover:text-slate-900 text-slate-500"
											>
												{agent}
											</SelectItem>
										))}
									</SelectContent>
									{fieldState.error && (
										<p className="text-red-500 text-sm mt-1">
											{fieldState.error.message}
										</p>
									)}
								</Select>
							)}
						/>
					</div>
				</div>
				<div className="w-full space-y-4">
					<Label className="flex items-center" htmlFor="name">
						{translation?.translations.csrName}
						<span className="text-orange-500">*</span>
					</Label>
					<Controller
						name="csr"
						control={control}
						render={({ field, fieldState }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
									{field.value || translation?.translations.csrName}
								</SelectTrigger>
								<SelectContent className="w-[360px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
									{csrNames.map((csr, index) => (
										<SelectItem
											value={csr}
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={index}
											className="hover:text-slate-900 text-slate-500"
										>
											{csr}
										</SelectItem>
									))}
								</SelectContent>
								{fieldState.error && (
									<p className="text-red-500 text-sm mt-1">
										{fieldState.error.message}
									</p>
								)}
							</Select>
						)}
					/>
				</div>
			</div>
			<div className="space-y-4">
				<Label className="flex items-center" htmlFor="name">
					{translation?.translations.clientName}
					<span className="text-orange-500">*</span>
				</Label>
				<Controller
					name="client_name"
					control={control}
					render={({ field, fieldState }) => (
						<>
							<Input
								id="client_name"
								{...field}
								placeholder={translation?.translations.clientName}
								className="ring-1 ring-slate-300 rounded-[8px] border-none"
							/>
							{fieldState.error && (
								<p className="text-sm text-red-500">
									{fieldState.error.message}
								</p>
							)}
						</>
					)}
				/>
			</div>
			<div className="space-y-4">
				<Label className="flex items-center" htmlFor="name">
					{translation?.translations.carrier}
					<span className="text-orange-500">*</span>
				</Label>
				<Controller
					name="insurance_carrier"
					control={control}
					render={({ field, fieldState }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
								{field.value || translation?.translations.carrier}
							</SelectTrigger>
							<SelectContent
								side="bottom"
								className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
							>
								{carriers.map((carrier, index) => (
									<SelectItem
										value={carrier}
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										className="hover:text-slate-900 text-slate-500"
									>
										{carrier}
									</SelectItem>
								))}
							</SelectContent>
							{fieldState.error && (
								<p className="text-red-500 text-sm mt-1">
									{fieldState.error.message}
								</p>
							)}
						</Select>
					)}
				/>
			</div>
			<Controller
				name="policy_term"
				control={control}
				render={({ field, fieldState }) => (
					<RadioGroup
						onValueChange={field.onChange}
						className="space-y-1"
						defaultValue={field.value}
					>
						<Label htmlFor="r1">{translation?.translations.policyTerm}</Label>

						<div className="flex gap-4">
							<div className="flex items-center space-x-1">
								<RadioGroupItem value="6 months" id="r1" />
								<Label htmlFor="r1">6 {translation?.translations.months}</Label>
							</div>
							<div className="flex items-center space-x-1">
								<RadioGroupItem value="12 months" id="r2" />
								<Label htmlFor="r2">
									12 {translation?.translations.months}
								</Label>
							</div>
						</div>
						{fieldState.error && (
							<p className="text-red-500 text-sm mt-1">
								{fieldState.error.message}
							</p>
						)}
					</RadioGroup>
				)}
			/>
			<div className="space-y-4">
				<Label className="flex items-center" htmlFor="name">
					{translation?.translations.quoteNumber}
				</Label>
				<Controller
					name="quote_number"
					control={control}
					render={({ field, fieldState }) => (
						<>
							<Input
								id="quote_number"
								{...field}
								placeholder={translation?.translations.quoteNumber}
								className="ring-1 ring-slate-300 rounded-[8px] border-none"
							/>
							{fieldState.error && (
								<p className="text-sm text-red-500">
									{fieldState.error.message}
								</p>
							)}
						</>
					)}
				/>
			</div>
		</>
	);
};
