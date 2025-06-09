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
import { carriers, csrNames, defaultAlternativeOption } from "@/lib/constants";
import { languages } from "@/lib/languages";
import type { Languages } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Info,
	Keyboard,
	Plus,
	RotateCcw,
	Shield,
	ShieldCheck,
	X,
} from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Quote from "./quote";
import {
	type QuoteFormSchema,
	alternativeVehicleSchema,
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
			alternativeOption: defaultAlternativeOption,
		},
	});

	const [showVehicleByIndex, setShowVehicleByIndex] = useState<number>(0);
	const [showAlternativeByIndex, setShowAlternativeByIndex] =
		useState<number>(0);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "vehicles",
	});

	const {
		fields: alternatives,
		append: addAlternativeOption,
		remove: removeAlternativeOption,
	} = useFieldArray({
		control,
		name: "alternativeOption",
	});

	const alternativeAddedFields = alternatives.slice(1);
	const alternativeDraftField = watch("alternativeOption.0");

	const [hasAlternativeOption, setHasAlternativeOption] = useState(false);

	const handleRemoveVehicle = (indexToRemove: number) => {
		const vehicleIndexInArray = indexToRemove + 1;

		if (showVehicleByIndex === vehicleIndexInArray) {
			setShowVehicleByIndex(0);
		} else if (showVehicleByIndex > vehicleIndexInArray) {
			setShowVehicleByIndex(showVehicleByIndex - 1);
		}

		remove(vehicleIndexInArray);
	};

	const handleRemoveAlternativeOption = (indexToRemove: number) => {
		const alternativeIndexInArray = indexToRemove + 1;

		if (showAlternativeByIndex === alternativeIndexInArray) {
			setShowAlternativeByIndex(0);
		} else if (showAlternativeByIndex > alternativeIndexInArray) {
			setShowAlternativeByIndex(showAlternativeByIndex - 1);
		}

		removeAlternativeOption(alternativeIndexInArray);
		toast.success("Opção alternativa removida com sucesso!");
	};

	const translation = languages[selectedLanguage];
	const agentNames = [
		"Joao da Silva",
		"Gustavo Fraga",
		"Jhonathan Oliveira",
		"Maria Vieira",
		translation.customAgent,
	];
	const [quoteData, setQuoteData] = useState<QuoteFormSchema | null>(null);

	const draftVehicle = watch("vehicles.0");
	const currentCoverageOpt = `vehicles.${showVehicleByIndex}.coverageOpt`;
	const rentersOptedIn = watch("rentersInsurance.optedIn");
	const feeOptedIn = watch("fee.optedIn");
	const fullPaymentOptedIn = watch("paymentAmounts.fullPayment.optedIn");
	const addedFields = fields.slice(1);
	const vehicles = useWatch({ control, name: "vehicles" });
	const currentVehicle = vehicles?.[showVehicleByIndex] ?? {};
	const deductibleOptedIn = currentVehicle?.deductible?.optedIn;
	const bodilyOptedIn = currentVehicle?.bodilyInjury?.optedIn;
	const medicalPaymentsOptedIn = currentVehicle?.medicalPayments?.optedIn;
	const propertyDamageOptedIn = currentVehicle?.propertyDamage?.optedIn;

	//alternative option variable

	const alternativeOption = useWatch({ control, name: "alternativeOption" });
	const currentAlternative = alternativeOption?.[showAlternativeByIndex];

	const deductibleAlternativeOptionOptedIn =
		currentAlternative?.deductible?.optedIn ?? false;
	const bodilyInjuryAlternativeOptionOptedIn =
		currentAlternative?.bodilyInjury?.optedIn ?? false;
	const medicalPaymentsAlternativeOptionOptedIn =
		currentAlternative?.medicalPayments?.optedIn ?? false;
	const propertyDamageAlternativeOptionOptedIn =
		currentAlternative?.propertyDamage?.optedIn ?? false;
	const fullPaymentAlternativeOptionOptedIn =
		currentAlternative?.fullPayment?.optedIn ?? false;

	const rentersInsuranceAlternativeOptedIn =
		currentAlternative?.rentersInsurance?.optedIn ?? false;

	const feeAlternativeOptedIn = currentAlternative?.fee?.optedIn ?? false;

	const addVehicleFromDraft = () => {
		const draft = watch("vehicles.0");

		if (!draft.name) return;

		try {
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

			toast.success("Veículo adicionado com sucesso!");
		} catch (error) {
			toast.error(
				"Campos obrigatórios faltando. Verifique os dados e tente novamente.",
			);
		}
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

	const handleOnClickAlternativeBadge = (index: number) => {
		setShowAlternativeByIndex(index + 1);

		if (hasAlternativeOption === false) {
			setHasAlternativeOption(true);
		}
	};

	const handleHasAlternativeOption = () => {
		if (hasAlternativeOption) {
			setHasAlternativeOption(!hasAlternativeOption);
			setValue("alternativeOption.0", {
				name: "",
				coverageOpt: null,
				deductible: { optedIn: false, value: 0 },
				bodilyInjury: { optedIn: false, value: "" },
				medicalPayments: { optedIn: false, value: "" },
				propertyDamage: { optedIn: false, value: "" },
				rentalCarCoverage: false,
				gapInsurance: false,
				extraCoverage: false,
				paymentAmounts: {
					firstPayment: 0,
					monthlyPayment: 0,
				},
				fullPayment: {
					optedIn: false,
					paymentAmount: 0,
				},
			});
		} else if (!hasAlternativeOption) {
			setHasAlternativeOption(!hasAlternativeOption);
			setValue("alternativeOption.0", {
				name: "",
				coverageOpt: null,
				deductible: { optedIn: false, value: 0 },
				bodilyInjury: { optedIn: true, value: "" },
				medicalPayments: { optedIn: false, value: "" },
				propertyDamage: { optedIn: true, value: "" },
				rentalCarCoverage: false,
				gapInsurance: false,
				extraCoverage: false,
				paymentAmounts: {
					firstPayment: 0,
					monthlyPayment: 0,
				},
				fullPayment: {
					optedIn: false,
					paymentAmount: 0,
				},
			});
		}
	};

	const handleAddAlternativeOption = () => {
		const draftAlternative = watch("alternativeOption.0");

		if (showAlternativeByIndex !== 0) {
			setShowAlternativeByIndex(0);
		}

		if (!draftAlternative.name) return;

		try {
			alternativeVehicleSchema.parse(draftAlternative);

			addAlternativeOption({
				...draftAlternative,
			});

			setValue("alternativeOption.0", {
				name: "",
				coverageOpt: null,
				deductible: { optedIn: false, value: 0 },
				bodilyInjury: { optedIn: true, value: "" },
				medicalPayments: { optedIn: false, value: "" },
				propertyDamage: { optedIn: true, value: "" },
				rentalCarCoverage: false,
				gapInsurance: false,
				extraCoverage: false,
				paymentAmounts: {
					firstPayment: 0,
					monthlyPayment: 0,
				},
				fullPayment: {
					optedIn: false,
					paymentAmount: 0,
				},
			});

			toast.success("Opção alternativa adicionada com sucesso!");
		} catch (error) {
			toast.error(
				"Campos obrigatórios faltando. Verifique os dados e tente novamente.",
			);
		}
	};

	const onSubmit = (data: QuoteFormSchema) => {
		setQuoteData(data);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onError = (errors: any) => {
		console.error("Erros de validação:", errors);
	};

	if (quoteData) {
		return <Quote data={quoteData} selectedLanguage={selectedLanguage} />;
	}

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
				<div className="flex flex-wrap max-w-[700px] my-5 gap-x-2 gap-y-4">
					{draftVehicle.name.length > 0 ? (
						<Badge
							onClick={() => setShowVehicleByIndex(0)}
							key={draftVehicle.name}
							className={
								showVehicleByIndex === 0
									? "bg-slate-700 text-white hover:cursor-pointer rounded-[8px] px-3 scale-105 py-2  flex items-center gap-2 transition-transform duration-300"
									: "bg-slate-500/70 text-white hover:cursor-pointer rounded-[8px] px-3 py-2  flex items-center gap-2 transition-transform duration-300"
							}
						>
							{draftVehicle.name}
						</Badge>
					) : (
						<Badge
							onClick={() => setShowVehicleByIndex(0)}
							key={draftVehicle.name}
							className="bg-slate-700 text-white rounded-[8px] px-3 py-2 flex items-center gap-2"
						>
							<Keyboard className="size-6" />
							{translation.typeToAddAvehicle}
						</Badge>
					)}
					{addedFields.map((field, index) => {
						return (
							<Badge
								onClick={() => setShowVehicleByIndex(index + 1)}
								key={field.id}
								className={
									showVehicleByIndex === index + 1
										? "bg-slate-700 text-white hover:cursor-pointer  rounded-[8px] px-3 scale-105 py-2  flex items-center gap-2 transition-transform duration-300"
										: "bg-slate-500/70 text-white hover:cursor-pointer rounded-[8px] px-3 py-2  flex items-center gap-2 transition-transform duration-300"
								}
							>
								{field.name}
								<button
									type="button"
									className="hover:cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveVehicle(index);
									}}
								>
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
						onInput={() => setShowVehicleByIndex(0)}
						{...register("vehicles.0.name")}
						className="ring-1 ring-slate-300 rounded-[8px] border-none"
					/>
				</div>
				<div>
					{/* aqui */}
					<div className="flex flex-wrap max-w-[700px] my-5 gap-x-4 gap-y-4">
						{alternativeDraftField.name.length > 0 && (
							<Badge
								onClick={() => setShowAlternativeByIndex(0)}
								className={
									showAlternativeByIndex === 0
										? "bg-blue-700 text-white hover:cursor-pointer rounded-[8px] px-3 scale-105 py-2  flex items-center gap-2 transition-transform duration-300"
										: "bg-blue-500/70 text-white hover:cursor-pointer rounded-[8px] px-3 py-2  flex items-center gap-2 transition-transform duration-300"
								}
							>
								{translation.alternativeOption} : {alternativeDraftField.name}
							</Badge>
						)}
						{alternativeAddedFields.map((alternative, index) => {
							return (
								<Badge
									onClick={() => handleOnClickAlternativeBadge(index)}
									key={alternative.id}
									className={
										showAlternativeByIndex === index + 1
											? "bg-blue-700 text-white hover:cursor-pointer  rounded-[8px] px-3 scale-105 py-2  flex items-center gap-2 transition-transform duration-300"
											: "bg-blue-500/70 text-white hover:cursor-pointer rounded-[8px] px-3 py-2  flex items-center gap-2 transition-transform duration-300"
									}
								>
									{translation.alternativeOption} : {alternative.name}
									<button
										onClick={() => {
											handleRemoveAlternativeOption(index);
										}}
										type="button"
										className="hover:cursor-pointer"
									>
										<X size={12} />
									</button>
								</Badge>
							);
						})}
					</div>
					{hasAlternativeOption === false ? (
						<Button
							type="button"
							className="bg-slate-700 hover:bg-slate-700/90 flex items-center rounded-[8px] text-white px-3 py-2"
							onClick={() => {
								handleHasAlternativeOption();
							}}
						>
							<Plus size={16} className="mr-1" />
							{translation.alternativeOption}
						</Button>
					) : (
						<Button
							type="button"
							className="bg-slate-700 hover:bg-slate-700/90 flex items-center rounded-[8px] text-white px-3 py-2"
							onClick={() => {
								handleAddAlternativeOption();
							}}
						>
							<Plus size={16} className="mr-1" />
							{translation.addAlternativeOption}
						</Button>
					)}
				</div>
				{hasAlternativeOption && (
					<div className="bg-slate-100 ring-1 p-5 space-y-4 ring-slate-300 rounded-[8px]">
						<div className="flex items-center  justify-between">
							<h3 className="text-base">{translation.alternativeOption}</h3>
							{showAlternativeByIndex !== 0 && alternatives.length > 1 && (
								<Button
									type="button"
									onClick={() => {
										setShowAlternativeByIndex(0);
									}}
									className="bg-slate-700 hover:bg-slate-700/90 flex items-center rounded-[8px] text-white px-3 py-2"
								>
									<RotateCcw size={16} className="mr-1" />
									Back to main alternative
								</Button>
							)}
							{alternatives.length === 1 && (
								<Button
									type="button"
									onClick={() => {
										handleHasAlternativeOption();
									}}
									className="bg-slate-700 hover:bg-slate-700/90 flex items-center rounded-[8px] text-white px-3 py-2"
								>
									<X size={16} className="mr-1" />
									Cancel
								</Button>
							)}
						</div>
						<div className="space-y-4">
							<Label className="flex items-center" htmlFor="name">
								{translation.alternativeOptionName}
							</Label>
							<Controller
								key={`input-${showAlternativeByIndex}`}
								name={`alternativeOption.${showAlternativeByIndex}.name`}
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										className="ring-1 ring-slate-400 rounded-[8px] border-none"
									/>
								)}
							/>
						</div>
						<div className="space-y-4">
							<Label className="flex items-center" htmlFor="name">
								{translation.coverageOptions}
							</Label>
							<div className="text-sm flex items-center gap-2 text-red-500 font-bold ">
								<Info className="size-5" />
								{translation.liabilityOnly}
							</div>
							<div className="space-y-4">
								{/* Deductible */}
								<div className="w-full flex items-center justify-between">
									<Label className="flex items-center" htmlFor="deductible">
										{translation.deductible}
									</Label>
									<Controller
										key={`deductible-opted-in-${showAlternativeByIndex}`}
										name={`alternativeOption.${showAlternativeByIndex}.deductible.optedIn`}
										control={control}
										render={({ field }) => (
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										)}
									/>
								</div>
								{deductibleAlternativeOptionOptedIn && (
									<Controller
										key={`deductible-value-${showAlternativeByIndex}`}
										name={`alternativeOption.${showAlternativeByIndex}.deductible.value`}
										control={control}
										render={({ field, fieldState }) => (
											<div>
												<RadioGroup
													// biome-ignore lint/suspicious/noExplicitAny: <explanation>
													onValueChange={(val: any) =>
														field.onChange(Number(val))
													}
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
										key={`bodily-injury-opted-in-${showAlternativeByIndex}`}
										name={`alternativeOption.${showAlternativeByIndex}.bodilyInjury.optedIn`}
										control={control}
										render={({ field }) => (
											<Switch
												checked={field.value}
												disabled
												onCheckedChange={field.onChange}
											/>
										)}
									/>
								</div>
								{bodilyInjuryAlternativeOptionOptedIn && (
									<Controller
										key={`bodily-injury-value-${showAlternativeByIndex}`}
										name={`alternativeOption.${showAlternativeByIndex}.bodilyInjury.value`}
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
							</div>
							{/* Medical Payments */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="medicalPayments">
									{translation.medicalPayments}
								</Label>
								<Controller
									key={`medical-payments-opted-in-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.medicalPayments.optedIn`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>
							{medicalPaymentsAlternativeOptionOptedIn && (
								<Controller
									key={`medical-payments-value-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.medicalPayments.value`}
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
									key={`property-damage-opted-in-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.propertyDamage.optedIn`}
									control={control}
									render={({ field }) => (
										<Switch
											disabled
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>
							{propertyDamageAlternativeOptionOptedIn && (
								<Controller
									key={`property-damage-value-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.propertyDamage.value`}
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
									key={`rental-car-coverage-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.rentalCarCoverage`}
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
									key={`gap-insurance-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.gapInsurance`}
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
									{translation.extraCoverage}
								</Label>
								<Controller
									key={`extra-coverage-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.extraCoverage`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>

							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="name">
									{translation.rentersInsurance}
								</Label>
								<Controller
									name={`alternativeOption.${showAlternativeByIndex}.rentersInsurance.optedIn`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>
							{rentersInsuranceAlternativeOptedIn && (
								<div className="flex-col flex gap-4">
									<div className="space-y-4">
										<Label className="flex items-center" htmlFor="name">
											{translation.rentersFirstPayment}
										</Label>
										<Controller
											name={`alternativeOption.${showAlternativeByIndex}.rentersInsurance.firstPayment`}
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
											name={`alternativeOption.${showAlternativeByIndex}.rentersInsurance.monthlyPayment`}
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
						</div>
						<div className="w-full flex items-center justify-between">
							<Label
								className="flex items-center text-slate-900"
								htmlFor="name"
							>
								{translation.addFee}
							</Label>
							<Controller
								name={`alternativeOption.${showAlternativeByIndex}.fee.optedIn`}
								control={control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</div>
						{feeAlternativeOptedIn && (
							<div className="flex-col flex gap-4">
								<div className="space-y-4">
									<Label
										className="flex items-center text-slate-900"
										htmlFor="name"
									>
										{translation.feeAmount}
									</Label>
									<Input
										{...register(
											`alternativeOption.${showAlternativeByIndex}.fee.value`,
										)}
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									<Label
										className="flex items-center text-slate-900 text-xs"
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
						<div className="space-y-4">
							<div className="flex w-full  gap-4">
								<div className="w-full space-y-4">
									<Label className="flex items-center" htmlFor="name">
										{translation.firstPayment}
									</Label>
									<Input
										key={`alternativeOption-${showAlternativeByIndex}-firstPayment`}
										{...register(
											`alternativeOption.${showAlternativeByIndex}.paymentAmounts.firstPayment`,
											{
												valueAsNumber: true,
											},
										)}
										type="number"
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									{
										<p className="text-red-500 text-sm">
											{
												errors.paymentAmounts?.paymentAmounts?.firstPayment
													?.message
											}
										</p>
									}
								</div>
								<div className="w-full space-y-4">
									<Label className="flex items-center" htmlFor="name">
										{translation.monthlyPayment}
									</Label>
									<Input
										key={`alternativeOption-${showAlternativeByIndex}-monthlyPayment`}
										{...register(
											`alternativeOption.${showAlternativeByIndex}.paymentAmounts.monthlyPayment`,
											{
												valueAsNumber: true,
											},
										)}
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
									key={`full-payment-opted-in-${showAlternativeByIndex}`}
									name={`alternativeOption.${showAlternativeByIndex}.fullPayment.optedIn`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={!!field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>

							{fullPaymentAlternativeOptionOptedIn && (
								<div className="flex-col flex gap-4">
									<div className="space-y-4">
										<Input
											{...register(
												`alternativeOption.${showAlternativeByIndex}.fullPayment.paymentAmount`,
												{
													valueAsNumber: true,
												},
											)}
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
					</div>
				)}
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
					</div>
					{errors?.vehicles?.[0]?.coverageOpt && (
						<p className="text-red-500 pt-2 text-sm mt-1">
							{errors.vehicles[0].coverageOpt.message}
						</p>
					)}
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
								{translation.extraCoverage}
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
							<Label
								className="flex items-center text-slate-900"
								htmlFor="name"
							>
								{translation.addFee}
							</Label>
							<Controller
								name="fee.optedIn"
								control={control}
								render={({ field }) => (
									<Switch
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
										className="flex items-center text-slate-900"
										htmlFor="name"
									>
										{translation.feeAmount}
									</Label>
									<Input
										{...register("fee.value")}
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									<Label
										className="flex items-center text-slate-900 text-xs"
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
