import { LanguageContext } from "@/app/language-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	fetchBodilyInjuryOptions,
	fetchMedicalPaymentsOptions,
	fetchPropertyDamageOptions,
	supabase,
} from "@/lib/create";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Shield, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { AlternativeOptionSchema, FormSchema } from "../schemas";

type ToggleState = {
	deductibleEnabled: boolean;
	bodilyInjuryEnabled: boolean;
	medicalPaymentsEnabled: boolean;
	propertyDamageEnabled: boolean;
	rentersInsuranceEnabled: boolean;
	feeEnabled: boolean;
};

export const AlternativeOptionsForm = () => {
	const translation = useContext(LanguageContext);
	const { control, watch, setValue } = useFormContext<FormSchema>();
	const queryClient = useQueryClient();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "alternativeOption",
	});

	// Estados para inputs customizados
	const [showCustomBodilyInjury, setShowCustomBodilyInjury] = useState(false);
	const [showCustomMedicalPayments, setShowCustomMedicalPayments] =
		useState(false);
	const [showCustomPropertyDamage, setShowCustomPropertyDamage] =
		useState(false);
	const [customBodilyInjury, setCustomBodilyInjury] = useState("");
	const [customMedicalPayments, setCustomMedicalPayments] = useState("");
	const [customPropertyDamage, setCustomPropertyDamage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Função para inserir valores customizados
	const handleInsertNewCustomValue = async (
		option: string,
		value: string,
		name: string,
	) => {
		setIsLoading(true);
		try {
			const { error } = await supabase.from(option).insert([{ [name]: value }]);
			setIsLoading(false);
			toast.success(`${value} added successfully`);

			if (error) {
				console.error("Erro ao inserir:", error);
				toast.error(`${value} already exists`);
				return;
			}

			// Invalida e refaz as queries baseado no tipo de insert
			if (option === "bodily_options") {
				await queryClient.invalidateQueries({
					queryKey: ["bodily-injury-options"],
				});
				setCustomBodilyInjury("");
				setShowCustomBodilyInjury(false);
			} else if (option === "medical_options") {
				await queryClient.invalidateQueries({
					queryKey: ["medical-payments-options"],
				});
				setCustomMedicalPayments("");
				setShowCustomMedicalPayments(false);
			} else if (option === "property_options") {
				await queryClient.invalidateQueries({
					queryKey: ["property-damage-options"],
				});
				setCustomPropertyDamage("");
				setShowCustomPropertyDamage(false);
			}
		} catch (error) {
			console.error("Erro ao inserir:", error);
		}
	};

	// Fetch options from API
	const { data: bodilyInjuryOptions, error: bodilyInjuryError } = useQuery({
		queryKey: ["bodily-injury-options"],
		queryFn: fetchBodilyInjuryOptions,
	});

	const { data: medicalPaymentsOptions, error: medicalPaymentsError } =
		useQuery({
			queryKey: ["medical-payments-options"],
			queryFn: fetchMedicalPaymentsOptions,
		});

	const { data: propertyDamageOptions, error: propertyDamageError } = useQuery({
		queryKey: ["property-damage-options"],
		queryFn: fetchPropertyDamageOptions,
	});

	const [currentIndex, setCurrentIndex] = useState(0);
	const [optionToggleStates, setOptionToggleStates] = useState<{
		[optionIndex: number]: ToggleState;
	}>({});

	// Observar todos os valores das opções
	const optionNames = fields.map((_, index) =>
		watch(`alternativeOption.${index}.name`),
	);
	const optionDeductibles = fields.map((_, index) =>
		watch(`alternativeOption.${index}.deductible`),
	);
	const optionBodilyInjuries = fields.map((_, index) =>
		watch(`alternativeOption.${index}.bodily_injury`),
	);
	const optionMedicalPayments = fields.map((_, index) =>
		watch(`alternativeOption.${index}.medical_payments`),
	);
	const optionPropertyDamages = fields.map((_, index) =>
		watch(`alternativeOption.${index}.property_damage`),
	);
	const optionCoverageOptions = fields.map((_, index) =>
		watch(`alternativeOption.${index}.coverage_options`),
	);
	const optionFirstPayments = fields.map((_, index) =>
		watch(`alternativeOption.${index}.payment_amount_first_payment`),
	);
	const optionMonthlyPayments = fields.map((_, index) =>
		watch(`alternativeOption.${index}.payment_amount_monthly_payment`),
	);
	const optionRentersFirstPayments = fields.map((_, index) =>
		watch(`alternativeOption.${index}.renters_first_payment`),
	);
	const optionRentersMonthlyPayments = fields.map((_, index) =>
		watch(`alternativeOption.${index}.renters_monthly_payment`),
	);
	const optionFees = fields.map((_, index) =>
		watch(`alternativeOption.${index}.fee`),
	);
	const watchedRentalCar = watch(
		`alternativeOption.${currentIndex}.rental_car_coverage`,
	);
	const watchedGapInsurance = watch(
		`alternativeOption.${currentIndex}.gap_insurance`,
	);
	const watchedExtraCoverage = watch(
		`alternativeOption.${currentIndex}.extra_coverage`,
	);

	// Get current option's toggle states
	const currentOptionStates = optionToggleStates[currentIndex] || {
		deductibleEnabled: false,
		bodilyInjuryEnabled: false,
		medicalPaymentsEnabled: false,
		propertyDamageEnabled: false,
		rentersInsuranceEnabled: false,
		feeEnabled: false,
	};

	const {
		deductibleEnabled,
		bodilyInjuryEnabled,
		medicalPaymentsEnabled,
		propertyDamageEnabled,
		rentersInsuranceEnabled,
		feeEnabled,
	} = currentOptionStates;

	// Helper functions to update individual toggle states
	const updateToggleState = (field: keyof ToggleState, value: boolean) => {
		setOptionToggleStates((prev) => ({
			...prev,
			[currentIndex]: {
				...prev[currentIndex],
				[field]: value,
			},
		}));
	};

	// Initialize toggle states for existing options when currentIndex changes
	useEffect(() => {
		const currentOption = fields[currentIndex];
		if (currentOption) {
			const newState = {
				deductibleEnabled: !!currentOption.deductible,
				bodilyInjuryEnabled: !!currentOption.bodily_injury,
				medicalPaymentsEnabled: !!currentOption.medical_payments,
				propertyDamageEnabled: !!currentOption.property_damage,
				rentersInsuranceEnabled:
					!!currentOption.renters_first_payment ||
					!!currentOption.renters_monthly_payment,
				feeEnabled: !!currentOption.fee,
			};

			setOptionToggleStates((prev) => {
				if (JSON.stringify(prev[currentIndex]) === JSON.stringify(newState)) {
					return prev;
				}
				return {
					...prev,
					[currentIndex]: newState,
				};
			});
		}
	}, [currentIndex, fields]);

	// Auto-enable coverage options when Liability Only is selected
	useEffect(() => {
		const currentCoverageOption = optionCoverageOptions[currentIndex];
		if (currentCoverageOption === "Liability Only") {
			const newState = {
				...currentOptionStates,
				bodilyInjuryEnabled: true,
				propertyDamageEnabled: true,
			};

			setOptionToggleStates((prev) => {
				if (JSON.stringify(prev[currentIndex]) === JSON.stringify(newState)) {
					return prev;
				}
				return {
					...prev,
					[currentIndex]: newState,
				};
			});
		}
	}, [optionCoverageOptions, currentIndex, currentOptionStates]);

	const addOption = () => {
		const newOption: AlternativeOptionSchema = {
			name: "new option",
			coverage_options: "Liability Only",
			bodily_injury: "$35,000 / $80,000",
			deductible: "$500",
			medical_payments: "$5,000",
			property_damage: "$100,000",
			rental_car_coverage: false,
			gap_insurance: false,
			extra_coverage: false,
			renters_first_payment: "",
			renters_monthly_payment: "",
			fee: "",
			payment_amount_first_payment: "",
			payment_amount_monthly_payment: "",
		};
		append(newOption);
		const newIndex = fields.length;
		setCurrentIndex(newIndex);
		setOptionToggleStates((prev) => ({
			...prev,
			[newIndex]: {
				deductibleEnabled: false,
				bodilyInjuryEnabled: true,
				medicalPaymentsEnabled: false,
				propertyDamageEnabled: true,
				rentersInsuranceEnabled: false,
				feeEnabled: false,
			},
		}));
	};

	const removeOption = (index: number) => {
		remove(index);
		const newLength = fields.length - 1;
		if (newLength > 0) {
			setCurrentIndex(Math.min(currentIndex, newLength - 1));
		} else {
			setCurrentIndex(0);
		}
	};

	return (
		<>
			<div className="w-full flex justify-between">
				<Label>{translation?.translations.alternativeOptions}</Label>
				<Button
					onClick={addOption}
					type="button"
					variant={"default"}
					className=""
				>
					<Plus size={16} className="mr-1" />
					{translation?.translations.addAlternativeOption}
				</Button>
			</div>

			<div className="flex flex-wrap gap-2">
				{fields.map((field, index) => {
					const optionName = optionNames[index];

					return (
						<div key={field.id} className="relative">
							<Badge
								className={`cursor-pointer text-sm transition-all duration-200 ${
									index === currentIndex
										? "bg-purple-600 hover:bg-purple-700 text-white shadow-md ring-2 ring-purple-200"
										: "bg-purple-100 hover:bg-purple-200 text-purple-700"
								}`}
								onClick={() => setCurrentIndex(index)}
							>
								{`${translation?.translations.alternativeOption}: ${optionName || `Option ${index + 1}`}`}
								<button
									type="button"
									className={`ml-2 cursor-pointer transition-colors ${
										index === currentIndex
											? "text-purple-200 hover:text-white"
											: "text-purple-400 hover:text-purple-600"
									}`}
									onClick={(e) => {
										e.stopPropagation();
										removeOption(index);
									}}
								>
									<X size={12} />
								</button>
							</Badge>
						</div>
					);
				})}
			</div>

			{fields.length > 0 ? (
				<div className="space-y-8">
					{/* Option Name */}
					<div className="bg-slate-50 p-6 rounded-[8px] space-y-6">
						<div className="space-y-2">
							<Label className="text-base font-medium" htmlFor="name">
								{translation?.translations.alternativeOptionName}
							</Label>
							<Controller
								name={`alternativeOption.${currentIndex}.name`}
								control={control}
								render={({ field, fieldState }) => (
									<>
										<Input
											id={`alternativeOption.${currentIndex}.name`}
											{...field}
											value={optionNames[currentIndex] || ""}
											onChange={(e) => {
												field.onChange(e);
												setValue(
													`alternativeOption.${currentIndex}.name`,
													e.target.value,
												);
											}}
											placeholder={
												translation?.translations
													.alternativeOptionNamePlaceholder
											}
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
					</div>

					{/* Coverage Options */}
					<div className="bg-slate-50 p-6 rounded-[8px] space-y-6">
						<Label className="text-base font-medium">
							{translation?.translations.coverageOptions}
						</Label>

						<div className="flex gap-4">
							<Controller
								name={`alternativeOption.${currentIndex}.coverage_options`}
								control={control}
								render={({ field: { onChange } }) => (
									<Button
										type="button"
										variant={
											optionCoverageOptions[currentIndex] === "Liability Only"
												? "default"
												: "secondary"
										}
										onClick={() => onChange("Liability Only")}
									>
										<Shield size={16} className="mr-1" />
										{translation?.translations.liabilityOnly}
									</Button>
								)}
							/>
						</div>

						{/* Coverage Details */}
						<div className="space-y-2">
							{/* Deductible */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="deductible">
									{translation?.translations.deductible}
								</Label>
								<Switch
									checked={deductibleEnabled}
									onCheckedChange={(value) =>
										optionCoverageOptions[currentIndex] === "Liability Only"
											? null
											: updateToggleState("deductibleEnabled", value)
									}
								/>
							</div>
							{deductibleEnabled && (
								<Controller
									name={`alternativeOption.${currentIndex}.deductible`}
									control={control}
									render={({ field, fieldState }) => (
										<div>
											<RadioGroup
												value={optionDeductibles[currentIndex]}
												onValueChange={field.onChange}
											>
												<div className="flex gap-4">
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="$500"
															id={`r1-${currentIndex}`}
														/>
														<Label htmlFor={`r1-${currentIndex}`}>$500</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="$1000"
															id={`r2-${currentIndex}`}
														/>
														<Label htmlFor={`r2-${currentIndex}`}>$1000</Label>
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
									{translation?.translations.bodilyInjury}
								</Label>
								<Switch
									checked={
										optionCoverageOptions[currentIndex] === "Liability Only"
											? true
											: bodilyInjuryEnabled
									}
									onCheckedChange={(value) =>
										optionCoverageOptions[currentIndex] === "Liability Only"
											? null
											: updateToggleState("bodilyInjuryEnabled", value)
									}
									disabled={
										optionCoverageOptions[currentIndex] === "Liability Only"
									}
								/>
							</div>

							{bodilyInjuryEnabled && (
								<Controller
									name={`alternativeOption.${currentIndex}.bodily_injury`}
									control={control}
									render={({ field, fieldState }) => (
										<Select
											value={optionBodilyInjuries[currentIndex]}
											onValueChange={(value: string) => {
												if (value === "customBodilyInjury") {
													setShowCustomBodilyInjury(true);
												} else {
													setShowCustomBodilyInjury(false);
													field.onChange(value);
												}
											}}
										>
											<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{optionBodilyInjuries[currentIndex] ||
													translation?.translations.bodilyInjury}
											</SelectTrigger>
											<SelectContent
												side="bottom"
												className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
											>
												{bodilyInjuryOptions?.map((bodily) => (
													<SelectItem
														value={bodily.bodily_coverage}
														key={bodily.id}
														className="hover:text-slate-900 text-slate-500"
													>
														{bodily.bodily_coverage}
													</SelectItem>
												))}
												<SelectItem
													value="customBodilyInjury"
													className="hover:text-slate-900 text-slate-500 border-t border-slate-200"
												>
													<div className="flex items-center gap-2">
														<Plus size={14} />
														Custom Bodily Injury
													</div>
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
							{showCustomBodilyInjury && (
								<div className="flex items-center gap-2">
									<Input
										id="custom_bodily_injury"
										onChange={(e) => setCustomBodilyInjury(e.target.value)}
										placeholder="Custom Bodily Injury"
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									<Button
										type="button"
										variant="default"
										disabled={!customBodilyInjury || isLoading}
										onClick={() =>
											handleInsertNewCustomValue(
												"bodily_options",
												customBodilyInjury,
												"bodily_coverage",
											)
										}
									>
										<Check size={14} />
									</Button>
								</div>
							)}

							{/* Medical Payments */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="medicalPayments">
									{translation?.translations.medicalPayments}
								</Label>
								<Switch
									checked={medicalPaymentsEnabled}
									onCheckedChange={(value: boolean) =>
										updateToggleState("medicalPaymentsEnabled", value)
									}
								/>
							</div>

							{medicalPaymentsEnabled && (
								<Controller
									name={`alternativeOption.${currentIndex}.medical_payments`}
									control={control}
									render={({ field, fieldState }) => (
										<Select
											value={optionMedicalPayments[currentIndex]}
											onValueChange={(value: string) => {
												if (value === "customMedicalPayments") {
													setShowCustomMedicalPayments(true);
												} else {
													setShowCustomMedicalPayments(false);
													field.onChange(value);
												}
											}}
										>
											<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{optionMedicalPayments[currentIndex] ||
													translation?.translations.medicalPayments}
											</SelectTrigger>
											<SelectContent
												side="bottom"
												className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
											>
												{medicalPaymentsOptions?.map((medical) => (
													<SelectItem
														value={medical.medical_coverage}
														key={medical.id}
														className="hover:text-slate-900 text-slate-500"
													>
														{medical.medical_coverage}
													</SelectItem>
												))}
												<SelectItem
													value="customMedicalPayments"
													className="hover:text-slate-900 text-slate-500 border-t border-slate-200"
												>
													<div className="flex items-center gap-2">
														<Plus size={14} />
														Custom Medical Payments
													</div>
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
							{showCustomMedicalPayments && (
								<div className="flex items-center gap-2">
									<Input
										id="custom_medical_payments"
										onChange={(e) => setCustomMedicalPayments(e.target.value)}
										placeholder="Custom Medical Payments"
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									<Button
										type="button"
										variant="default"
										disabled={!customMedicalPayments || isLoading}
										onClick={() =>
											handleInsertNewCustomValue(
												"medical_options",
												customMedicalPayments,
												"medical_coverage",
											)
										}
									>
										<Check size={14} />
									</Button>
								</div>
							)}

							{/* Property Damage */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="propertyDamage">
									{translation?.translations.propertyDamage}
								</Label>
								<Switch
									checked={
										optionCoverageOptions[currentIndex] === "Liability Only"
											? true
											: propertyDamageEnabled
									}
									onCheckedChange={(value) =>
										optionCoverageOptions[currentIndex] === "Liability Only"
											? null
											: updateToggleState("propertyDamageEnabled", value)
									}
									disabled={
										optionCoverageOptions[currentIndex] === "Liability Only"
									}
								/>
							</div>

							{propertyDamageEnabled && (
								<Controller
									name={`alternativeOption.${currentIndex}.property_damage`}
									control={control}
									render={({ field, fieldState }) => (
										<Select
											value={optionPropertyDamages[currentIndex]}
											onValueChange={(value: string) => {
												if (value === "customPropertyDamage") {
													setShowCustomPropertyDamage(true);
												} else {
													setShowCustomPropertyDamage(false);
													field.onChange(value);
												}
											}}
										>
											<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{optionPropertyDamages[currentIndex] ||
													translation?.translations.propertyDamage}
											</SelectTrigger>
											<SelectContent
												side="bottom"
												className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
											>
												{propertyDamageOptions?.map((propertyDamage) => (
													<SelectItem
														value={propertyDamage.property_coverage}
														key={propertyDamage.id}
														className="hover:text-slate-900 text-slate-500"
													>
														{propertyDamage.property_coverage}
													</SelectItem>
												))}
												<SelectItem
													value="customPropertyDamage"
													className="hover:text-slate-900 text-slate-500 border-t border-slate-200"
												>
													<div className="flex items-center gap-2">
														<Plus size={14} />
														Custom Property Damage
													</div>
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
							{showCustomPropertyDamage && (
								<div className="flex items-center gap-2">
									<Input
										id="custom_property_damage"
										onChange={(e) => setCustomPropertyDamage(e.target.value)}
										placeholder="Custom Property Damage"
										className="ring-1 ring-slate-300 rounded-[8px] border-none"
									/>
									<Button
										type="button"
										variant="default"
										disabled={!customPropertyDamage || isLoading}
										onClick={() =>
											handleInsertNewCustomValue(
												"property_options",
												customPropertyDamage,
												"property_coverage",
											)
										}
									>
										<Check size={14} />
									</Button>
								</div>
							)}

							{/* Rental Car Coverage */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="rentalCar">
									{translation?.translations.rentalCar}
								</Label>
								<Controller
									name={`alternativeOption.${currentIndex}.rental_car_coverage`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={watchedRentalCar}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>

							{/* Gap Insurance */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="gapInsurance">
									{translation?.translations.gapInsurance}
								</Label>
								<Controller
									name={`alternativeOption.${currentIndex}.gap_insurance`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={watchedGapInsurance}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>

							{/* Extra Coverage */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="extraCoverage">
									{translation?.translations.extraCoverage}
								</Label>
								<Controller
									name={`alternativeOption.${currentIndex}.extra_coverage`}
									control={control}
									render={({ field }) => (
										<Switch
											checked={watchedExtraCoverage}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
							</div>
						</div>
					</div>

					{/* Payment Options */}
					<div className="space-y-4 mt-4">
						{/* Renters Insurance */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="rentersInsurance">
								{translation?.translations.rentersInsurance}
							</Label>
							<Switch
								checked={rentersInsuranceEnabled}
								onCheckedChange={(value) =>
									updateToggleState("rentersInsuranceEnabled", value)
								}
							/>
						</div>

						{rentersInsuranceEnabled && (
							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label
										htmlFor="renters_first_payment"
										className="text-sm font-medium"
									>
										{translation?.translations.rentersFirstPayment}
									</Label>
									<Controller
										name={`alternativeOption.${currentIndex}.renters_first_payment`}
										control={control}
										render={({ field, fieldState }) => (
											<>
												<Input
													id="renters_first_payment"
													{...field}
													value={optionRentersFirstPayments[currentIndex] || ""}
													onChange={(e) => {
														field.onChange(e);
														setValue(
															`alternativeOption.${currentIndex}.renters_first_payment`,
															e.target.value,
														);
													}}
													placeholder={
														translation?.translations.rentersFirstPayment
													}
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

								<div className="space-y-2">
									<Label
										htmlFor="renters_monthly_payment"
										className="text-sm font-medium"
									>
										{translation?.translations.rentersMonthlyPayment}
									</Label>
									<Controller
										name={`alternativeOption.${currentIndex}.renters_monthly_payment`}
										control={control}
										render={({ field, fieldState }) => (
											<>
												<Input
													id="renters_monthly_payment"
													{...field}
													value={
														optionRentersMonthlyPayments[currentIndex] || ""
													}
													onChange={(e) => {
														field.onChange(e);
														setValue(
															`alternativeOption.${currentIndex}.renters_monthly_payment`,
															e.target.value,
														);
													}}
													placeholder={
														translation?.translations.rentersMonthlyPayment
													}
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
							</div>
						)}

						{/* Fee */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="fee">
								{translation?.translations.addFee}
							</Label>
							<Switch
								checked={feeEnabled}
								onCheckedChange={(value) =>
									updateToggleState("feeEnabled", value)
								}
							/>
						</div>

						{feeEnabled && (
							<div className="space-y-2">
								<Controller
									name={`alternativeOption.${currentIndex}.fee`}
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Input
												id="fee"
												{...field}
												value={optionFees[currentIndex] || ""}
												onChange={(e) => {
													field.onChange(e);
													setValue(
														`alternativeOption.${currentIndex}.fee`,
														e.target.value,
													);
												}}
												placeholder={translation?.translations.feeAmount}
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
						)}
					</div>

					{/* Payment Summary Section */}
					<div className="space-y-4 mt-4">
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label
									htmlFor="payment_amount_first_payment"
									className="text-sm font-medium"
								>
									{translation?.translations.firstPayment}
								</Label>
								<Controller
									name={`alternativeOption.${currentIndex}.payment_amount_first_payment`}
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Input
												id="payment_amount_first_payment"
												{...field}
												value={optionFirstPayments[currentIndex] || ""}
												onChange={(e) => {
													field.onChange(e);
													setValue(
														`alternativeOption.${currentIndex}.payment_amount_first_payment`,
														e.target.value,
													);
												}}
												placeholder={translation?.translations.firstPayment}
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

							<div className="space-y-2">
								<Label
									htmlFor="payment_amount_monthly_payment"
									className="text-sm font-medium"
								>
									{translation?.translations.monthlyPayment}
								</Label>
								<Controller
									name={`alternativeOption.${currentIndex}.payment_amount_monthly_payment`}
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Input
												id="payment_amount_monthly_payment"
												{...field}
												value={optionMonthlyPayments[currentIndex] || ""}
												onChange={(e) => {
													field.onChange(e);
													setValue(
														`alternativeOption.${currentIndex}.payment_amount_monthly_payment`,
														e.target.value,
													);
												}}
												placeholder={translation?.translations.monthlyPayment}
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
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<h3 className="text-sm text-slate-500">
						{translation?.translations.addAlternativeOption}
					</h3>
					<p className="text-sm text-slate-500">
						{translation?.translations.alternativeOptionsExplanation}
					</p>
				</div>
			)}
		</>
	);
};
