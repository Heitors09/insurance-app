import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { carriers, csrNames } from "@/lib/constants";
import { languages } from "@/lib/languages";
import type { Languages } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Keyboard, Plus, Shield, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
	type QuoteFormSchema,
	quoteFormSchema,
	vehicleSchema,
} from "./schemas";

export default function GenerateQuote({
	selectedLanguage,
}: { selectedLanguage: Languages }) {
	//variables
	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<QuoteFormSchema>({
		resolver: zodResolver(quoteFormSchema),
		defaultValues: {
			vehicles: [
				{
					name: "",
					coverageOpt: null,
					deductible: { optedIn: false, value: 0 },
					bodilyInjury: { optedIn: false, value: "" },
					medicalPayments: { optedIn: false, value: "" },
					propertyDamage: { optedIn: false, value: "" },
					rentalCarCoverage: false,
					gapInsurance: false,
				},
			],
		},
	});

	const [showVehicleByIndex, setShowVehicleByIndex] = useState<number | null>(
		null,
	);

	console.log(showVehicleByIndex);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "vehicles",
	});

	const translation = languages[selectedLanguage];
	const agentNames = [
		"Joao da Silva",
		"Gustavo Fraga",
		"Jhonathan Oliveira",
		"Maria Vieira",
		translation.customAgent,
	];
	const [quoteData, setQuoteData] = useState(null);

	const draftVehicle = watch("vehicles.0");
	console.log(draftVehicle);
	const currentCoverageOpt = watch("vehicles.0.coverageOpt");
	const deductibleOptedIn = useWatch({
		control,
		name: `vehicles.${showVehicleByIndex || 0}.deductible.optedIn`,
	});

	const bodilyOptedIn = useWatch({
		control,
		name: `vehicles.${showVehicleByIndex || 0}.bodilyInjury.optedIn`,
	});

	const medicalPaymentsOptedIn = useWatch({
		control,
		name: `vehicles.${showVehicleByIndex || 0}.medicalPayments.optedIn`,
	});

	const propertyDamageOptedIn = useWatch({
		control,
		name: `vehicles.${showVehicleByIndex || 0}.propertyDamage.optedIn`,
	});
	const rentersOptedIn = watch("rentersInsurance.optedIn");
	const feeOptedIn = watch("fee.optedIn");
	const fullPaymentOptedIn = watch("paymentAmounts.fullPayment.optedIn");
	const addedFields = fields.slice(1);
	const currentVehicle = watch(
		showVehicleByIndex !== null
			? `vehicles.${showVehicleByIndex}`
			: "vehicles.0",
	);

	//functions

	const addVehicleFromDraft = () => {
		const draft = watch("vehicles.0");

		if (!draft.name) return;

		vehicleSchema.parse(draft);

		append({
			...draft,
		});

		setValue("vehicles.0", {
			name: "",
			coverageOpt: null,
			deductible: { optedIn: false, value: 0 },
			bodilyInjury: { optedIn: false, value: "" },
			medicalPayments: { optedIn: false, value: "" },
			propertyDamage: { optedIn: false, value: "" },
			rentalCarCoverage: false,
			gapInsurance: false,
			extraCoverage: false,
		});
	};

	const handleSetCoverageType = (
		index: number,
		type: "Liability Only" | "Full Coverage",
	) => {
		setValue(`vehicles.${index}.coverageOpt`, type);

		if (type === "Full Coverage") {
			setValue(`vehicles.${index}.deductible.optedIn`, true);
			setValue(`vehicles.${index}.bodilyInjury.optedIn`, true);
			setValue(`vehicles.${index}.propertyDamage.optedIn`, true);
		} else if (type === "Liability Only") {
			setValue(`vehicles.${index}.deductible.optedIn`, false);
			setValue(`vehicles.${index}.bodilyInjury.optedIn`, true);
			setValue(`vehicles.${index}.propertyDamage.optedIn`, true);
		}
	};

	const clearCoverageType = (index: number) => {
		setValue(`vehicles.${index}.coverageOpt`, null);
		setValue(`vehicles.${index}.deductible.optedIn`, false);
		setValue(`vehicles.${index}.bodilyInjury.optedIn`, false);
		setValue(`vehicles.${index}.propertyDamage.optedIn`, false);
	};

	const onSubmit = (data: QuoteFormSchema) => {
		console.log(data);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onError = (errors: any) => {
		console.error("Erros de validação:", errors);
	};

	return (
		<Card className="border-none bg-white text-slate-900 ring-1 ring-slate-200 px-8 flex flex-col items-center text-slate-900 rounded-[8px]">
			<CardTitle className="text-xl">{translation.autoInsurance}</CardTitle>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className="w-full space-y-4"
			>
				<Label htmlFor="name">{translation.insuranceTypeLabel}</Label>
				<Controller
					name="InsuranceType"
					control={control}
					render={({ field, fieldState }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
								{field.value || translation.insuranceTypeLabel}
							</SelectTrigger>
							<SelectContent className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
								<SelectItem
									value={translation.autoInsuranceType}
									className="hover:text-slate-900 text-slate-500"
								>
									{translation.autoInsuranceType}
								</SelectItem>
								<SelectSeparator className="bg-slate-300 mx-2" />
								<SelectItem
									value={translation.commercialAutoInsuranceType}
									className="hover:text-slate-900 text-slate-500"
								>
									{translation.commercialAutoInsuranceType}
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
				<div className="flex w-full gap-4">
					<div className="w-full space-y-4">
						<Label className="flex items-center" htmlFor="name">
							{translation.agentName}
							<span className="text-orange-500">*</span>
						</Label>
						<Controller
							name="agent"
							control={control}
							render={({ field, fieldState }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{field.value || translation.agentName}
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
					<div className="w-full space-y-4">
						<Label className="flex items-center" htmlFor="name">
							{translation.csrName}
							<span className="text-orange-500">*</span>
						</Label>
						<Controller
							name="csr"
							control={control}
							render={({ field, fieldState }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{field.value || translation.csrName}
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
						{translation.clientName}
						<span className="text-orange-500">*</span>
					</Label>
					<Input
						{...register("clientName")}
						className="ring-1 ring-slate-300 rounded-[8px] border-none"
					/>
					{errors.clientName && (
						<p className="text-red-500 text-sm">{errors.clientName.message}</p>
					)}
				</div>
				<div className="space-y-4">
					<Label className="flex items-center" htmlFor="name">
						{translation.carrier}
						<span className="text-orange-500">*</span>
					</Label>
					<Controller
						name="carrier"
						control={control}
						render={({ field, fieldState }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
									{field.value || translation.carrier}
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
					name="months"
					control={control}
					render={({ field, fieldState }) => (
						<RadioGroup
							onValueChange={field.onChange}
							className="space-y-1"
							defaultValue={field.value}
						>
							<Label htmlFor="r1">{translation.policyTerm}</Label>

							<div className="flex gap-4">
								<div className="flex items-center space-x-1">
									<RadioGroupItem value="6" id="r1" />
									<Label htmlFor="r1">6 {translation.months}</Label>
								</div>
								<div className="flex items-center space-x-1">
									<RadioGroupItem value="12" id="r2" />
									<Label htmlFor="r2">12 {translation.months}</Label>
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
						{translation.quoteNumber}
					</Label>
					<Input
						{...register("quoteNumber")}
						className="ring-1 ring-slate-300 rounded-[8px] border-none"
					/>
				</div>
				<Separator className="bg-slate-300" />
				<div className="w-full flex  justify-between">
					<Label>{translation.vehicles}</Label>
					<Button
						type="button"
						className="bg-slate-700 hover:bg-slate-700/90 flex items-center rounded-[8px] text-white px-3 py-2"
						onClick={addVehicleFromDraft}
					>
						<Plus size={16} className="mr-1" />
						{translation.addVehicle}
					</Button>
				</div>
				<div className="flex gap-2">
					{draftVehicle.name.length > 0 ? (
						<Badge
							onClick={() => setShowVehicleByIndex(0)}
							key={draftVehicle.name}
							className="bg-slate-700 text-white rounded-[8px] px-3 py-2 mb-5 flex items-center gap-2"
						>
							{draftVehicle.name}
						</Badge>
					) : (
						<Badge
							onClick={() => setShowVehicleByIndex(0)}
							key={draftVehicle.name}
							className="bg-slate-700 text-white rounded-[8px] px-3 py-2 mb-5 flex items-center gap-2"
						>
							<Keyboard className="size-6" />
							Type to add vehicle
						</Badge>
					)}
					{addedFields.map((field, index) => {
						return (
							<Badge
								onClick={() => setShowVehicleByIndex(index + 1)}
								key={field.id}
								className="bg-slate-700 text-white rounded-[8px] px-3 py-2 mb-5 flex items-center gap-2"
							>
								{field.name}
								<button type="button" onClick={() => remove(index)}>
									<X size={12} />
								</button>
							</Badge>
						);
					})}
				</div>
				<div className="space-y-4">
					<Label className="flex items-center" htmlFor="name">
						{translation.vehicleName}
					</Label>
					<Input
						{...register("vehicles.0.name")}
						className="ring-1 ring-slate-300 rounded-[8px] border-none"
					/>
				</div>
				<div>
					<Button
						type="button"
						className="bg-slate-700 hover:bg-slate-700/90 flex items-center rounded-[8px] text-white px-3 py-2"
					>
						<Plus size={16} className="mr-1" />
						{translation.addAlternativeOption}
					</Button>
				</div>
				<Separator className="bg-slate-300" />
				{/* a partir desse ponto */}
				<div className="space-y-4">
					<Label className="flex items-center" htmlFor="name">
						{translation.coverageOptions}
					</Label>

					<div className="flex gap-4">
						<Button
							type="button"
							onClick={() =>
								handleSetCoverageType(showVehicleByIndex || 0, "Liability Only")
							}
							className={`${
								currentVehicle?.coverageOpt === "Liability Only"
									? "bg-slate-200"
									: ""
							} ring-slate-400 hover:bg-slate-200 ring-1 flex items-center rounded-[8px] text-slate-700 px-3 py-2`}
						>
							<Shield size={16} className="mr-1" />
							{translation.liabilityOnly}
						</Button>

						<Button
							type="button"
							onClick={() =>
								handleSetCoverageType(showVehicleByIndex || 0, "Full Coverage")
							}
							className={`${
								currentVehicle?.coverageOpt === "Full Coverage"
									? "bg-slate-200"
									: ""
							} ring-slate-400 hover:bg-slate-200 ring-1 flex items-center rounded-[8px] text-slate-700 px-3 py-2`}
						>
							<ShieldCheck size={16} className="mr-1" />
							{translation.fullCoverage}
						</Button>

						{currentCoverageOpt !== null && (
							<Button
								type="button"
								onClick={() => clearCoverageType(showVehicleByIndex || 0)}
								className="flex items-center shadow-none rounded-[8px] text-slate-700 px-3 py-2"
							>
								<X size={16} />
							</Button>
						)}
					</div>
					{errors?.vehicles?.[0]?.coverageOpt && (
						<p className="text-red-500 pt-2 text-sm mt-1">
							{errors.vehicles[0].coverageOpt.message}
						</p>
					)}
					{/* daqui */}
					<div className="space-y-4">
						{/* Deductible */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="deductible">
								{translation.deductible}
							</Label>
							<Controller
								key={`deductible-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.deductible.optedIn`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										disabled={currentCoverageOpt === "Full Coverage"}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						{deductibleOptedIn && (
							<Controller
								key={`deductible-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.deductible.value`}
								control={control}
								render={({ field, fieldState }) => (
									<div>
										<RadioGroup
											// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											onValueChange={(val: any) => field.onChange(Number(val))}
											value={field.value?.toString()}
										>
											<div className="flex gap-4">
												<div className="flex items-center space-x-1">
													<RadioGroupItem value="500" id="r1" />
													<Label htmlFor="r1">$500</Label>
												</div>
												<div className="flex items-center space-x-1">
													<RadioGroupItem value="1000" id="r2" />
													<Label htmlFor="r2">$1000</Label>
												</div>
											</div>
										</RadioGroup>
										{fieldState.error && (
											<p className="text-red-500 pt-2 text-sm mt-1">
												{fieldState.error.message}
											</p>
										)}
									</div>
								)}
							/>
						)}

						{/* Bodily Injury */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="bodilyInjury">
								{translation.bodilyInjury}
							</Label>
							<Controller
								key={`bodilyInjury-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.bodilyInjury.optedIn`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										disabled={currentCoverageOpt !== null}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						{bodilyOptedIn && (
							<Controller
								key={`bodilyInjury-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.bodilyInjury.value`}
								control={control}
								render={({ field, fieldState }) => (
									<Select onValueChange={field.onChange}>
										<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
											{field.value || translation.bodilyInjury}
										</SelectTrigger>
										<SelectContent className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
											<SelectItem value="$35,000/$80,000">
												$35,000/$80,000
											</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$50,000/$100,000">
												$50,000/$100,000
											</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$100,000/$300,000">
												$100,000/$300,000
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
						)}

						{/* Medical Payments */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="medicalPayments">
								{translation.medicalPayments}
							</Label>
							<Controller
								key={`medicalPayments-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.medicalPayments.optedIn`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						{medicalPaymentsOptedIn && (
							<Controller
								key={`medicalPayments-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.medicalPayments.value`}
								control={control}
								render={({ field, fieldState }) => (
									<Select onValueChange={field.onChange}>
										<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
											{field.value || translation.medicalPayments}
										</SelectTrigger>
										<SelectContent className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
											<SelectItem value="$5,000">$5,000</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$10,000">$10,000</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$15,000">$15,000</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$25,000">$25,000</SelectItem>
										</SelectContent>
										{fieldState.error && (
											<p className="text-red-500 text-sm mt-1">
												{fieldState.error.message}
											</p>
										)}
									</Select>
								)}
							/>
						)}

						{/* Property Damage */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="propertyDamage">
								{translation.propertyDamage}
							</Label>
							<Controller
								key={`propertyDamage-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.propertyDamage.optedIn`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={currentCoverageOpt !== null}
									/>
								)}
							/>
						</div>
						{propertyDamageOptedIn && (
							<Controller
								key={`propertyDamage-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.propertyDamage.value`}
								control={control}
								render={({ field, fieldState }) => (
									<Select onValueChange={field.onChange}>
										<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
											{field.value || translation.propertyDamage}
										</SelectTrigger>
										<SelectContent className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
											<SelectItem value="$50,000">$50,000</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$100,000">$100,000</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$150,000">$150,000</SelectItem>
											<SelectSeparator className="bg-slate-300 mx-2" />
											<SelectItem value="$250,000">$250,000</SelectItem>
										</SelectContent>
										{fieldState.error && (
											<p className="text-red-500 text-sm mt-1">
												{fieldState.error.message}
											</p>
										)}
									</Select>
								)}
							/>
						)}

						{/* Rental Car Coverage */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="rentalCar">
								{translation.rentalCar}
							</Label>
							<Controller
								key={`rentalCar-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.rentalCarCoverage`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>

						{/* Gap Insurance */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="gapInsurance">
								{translation.gapInsurance}
							</Label>
							<Controller
								key={`gapInsurance-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.gapInsurance`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>

						{/* Extra Coverage */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="extraCoverage">
								Extra Coverage
							</Label>
							<Controller
								key={`ExtraCoverage-${showVehicleByIndex}`}
								name={`vehicles.${showVehicleByIndex ?? 0}.extraCoverage`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>

						{/* até aqui */}
						<Separator className="bg-slate-300" />
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="name">
								{translation.rentersInsurance}
							</Label>
							<Controller
								name="rentersInsurance.optedIn"
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						{rentersOptedIn && (
							<div className="flex-col flex gap-4">
								<div className="space-y-4">
									<Label className="flex items-center" htmlFor="name">
										{translation.rentersFirstPayment}
									</Label>
									<Controller
										name="rentersInsurance.firstPayment"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												value={field.value || ""}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(
														value === "" ? undefined : Number(value),
													);
												}}
												className="ring-1 ring-slate-300 rounded-[8px] border-none"
											/>
										)}
									/>
								</div>
								{errors.rentersInsurance?.firstPayment && (
									<p className="text-red-500 text-sm">
										{errors.rentersInsurance.firstPayment?.message}
									</p>
								)}
								<div className="space-y-4">
									<Label className="flex items-center" htmlFor="name">
										{translation.rentersMonthlyPayment}
									</Label>
									<Controller
										name="rentersInsurance.monthlyPayment"
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type="number"
												value={field.value || ""}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(
														value === "" ? undefined : Number(value),
													);
												}}
												className="ring-1 ring-slate-300 rounded-[8px] border-none"
											/>
										)}
									/>
								</div>
								{errors.rentersInsurance?.monthlyPayment && (
									<p className="text-red-500 text-sm">
										{errors.rentersInsurance.monthlyPayment?.message}
									</p>
								)}
							</div>
						)}
						<Separator className="bg-slate-300" />
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center text-red-500" htmlFor="name">
								{translation.addFee}
							</Label>
							<Controller
								name="fee.optedIn"
								control={control}
								render={({ field }) => (
									<Switch
										className="data-[state=checked]:bg-red-500"
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						{feeOptedIn && (
							<div className="flex-col flex gap-4">
								<div className="space-y-4">
									<Label
										className="flex items-center text-red-500"
										htmlFor="name"
									>
										{translation.feeAmount}
									</Label>
									<Input
										{...register("fee.value")}
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									<Label
										className="flex items-center text-red-500 text-xs"
										htmlFor="name"
									>
										{" "}
										- {translation.feeMessage}
									</Label>
								</div>
								{errors.fee?.value && (
									<p className="text-red-500 text-sm">
										{errors.fee.value.message}
									</p>
								)}
							</div>
						)}
						<Separator className="bg-slate-300" />
					</div>
				</div>
				<div className="space-y-4">
					<Label className="flex items-center" htmlFor="name">
						{translation.paymentAmounts}
					</Label>
					<div className="flex w-full  gap-4">
						<div className="w-full space-y-4">
							<Label className="flex items-center" htmlFor="name">
								{translation.firstPayment}
							</Label>
							<Input
								{...register("paymentAmounts.paymentAmounts.firstPayment", {
									valueAsNumber: true,
								})}
								type="number"
								className="ring-1 ring-slate-300 rounded-[8px] border-none"
							/>
							{
								<p className="text-red-500 text-sm">
									{errors.paymentAmounts?.paymentAmounts?.firstPayment?.message}
								</p>
							}
						</div>
						<div className="w-full space-y-4">
							<Label className="flex items-center" htmlFor="name">
								{translation.monthlyPayment}
							</Label>
							<Input
								{...register("paymentAmounts.paymentAmounts.monthlyPayment", {
									valueAsNumber: true,
								})}
								type="number"
								className="ring-1 ring-slate-300 rounded-[8px] border-none"
							/>
							{
								<p className="text-red-500 text-sm">
									{
										errors.paymentAmounts?.paymentAmounts?.monthlyPayment
											?.message
									}
								</p>
							}
						</div>
					</div>
					<div className="flex justify-between">
						<Label className="flex items-center" htmlFor="name">
							{translation.fullPayment}
						</Label>
						<Controller
							name="paymentAmounts.fullPayment.optedIn"
							control={control}
							render={({ field }) => (
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
					</div>

					{fullPaymentOptedIn && (
						<div className="flex-col flex gap-4">
							<div className="space-y-4">
								<Input
									{...register("paymentAmounts.fullPayment.paymentAmount", {
										valueAsNumber: true,
									})}
									className="ring-1 ring-slate-300 rounded-[8px] border-none"
								/>
							</div>
							{errors.paymentAmounts?.fullPayment?.paymentAmount && (
								<p className="text-red-500 text-sm">
									{errors.paymentAmounts.fullPayment.paymentAmount.message}
								</p>
							)}
						</div>
					)}
				</div>
				<Button
					className="w-full bg-slate-700 py-5 rounded-[8px] text-white hover:bg-slate-700/90"
					type="submit"
				>
					<Plus size={16} className="mr-1" />
					{translation.generateQuote}
				</Button>
			</form>
		</Card>
	);
}
