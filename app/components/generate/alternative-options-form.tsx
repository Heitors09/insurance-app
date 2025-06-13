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
	bodilyInjuryConstant,
	medicalPaymentsConstant,
	propertyDamageConstant,
} from "@/lib/constants";
import { Plus, Shield, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
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

	const { fields, append, remove } = useFieldArray({
		control,
		name: "alternativeOption",
	});

	const [currentIndex, setCurrentIndex] = useState(0);
	const [optionToggleStates, setOptionToggleStates] = useState<{
		[optionIndex: number]: ToggleState;
	}>({});

	const watchedOptionName = watch(
		`alternativeOption.${currentIndex}.name` as const,
	);
	const watchedCoverageOptions = watch(
		`alternativeOption.${currentIndex}.coverage_options` as const,
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
		if (!optionToggleStates[currentIndex]) {
			setOptionToggleStates((prev) => ({
				...prev,
				[currentIndex]: {
					deductibleEnabled: false,
					bodilyInjuryEnabled: false,
					medicalPaymentsEnabled: false,
					propertyDamageEnabled: false,
					rentersInsuranceEnabled: false,
					feeEnabled: false,
				},
			}));
		}
	}, [currentIndex, optionToggleStates]);

	// Auto-enable coverage options when Liability Only is selected
	useEffect(() => {
		if (watchedCoverageOptions === "Liability Only") {
			setOptionToggleStates((prev) => ({
				...prev,
				[currentIndex]: {
					...prev[currentIndex],
					bodilyInjuryEnabled: true,
					propertyDamageEnabled: true,
					// Keep other toggles as is
				},
			}));
		}
	}, [watchedCoverageOptions, currentIndex]);

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
				bodilyInjuryEnabled: false,
				medicalPaymentsEnabled: false,
				propertyDamageEnabled: false,
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
					const optionName =
						index === currentIndex ? watchedOptionName : field.name;

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
											watchedCoverageOptions === "Liability Only"
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
										watchedCoverageOptions === "Liability Only"
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
												value={field.value}
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
										watchedCoverageOptions === "Liability Only"
											? true
											: bodilyInjuryEnabled
									}
									onCheckedChange={(value) =>
										watchedCoverageOptions === "Liability Only"
											? null
											: updateToggleState("bodilyInjuryEnabled", value)
									}
									disabled={watchedCoverageOptions === "Liability Only"}
								/>
							</div>

							{bodilyInjuryEnabled && (
								<Controller
									name={`alternativeOption.${currentIndex}.bodily_injury`}
									control={control}
									render={({ field, fieldState }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{field.value || translation?.translations.bodilyInjury}
											</SelectTrigger>
											<SelectContent
												side="bottom"
												className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
											>
												{bodilyInjuryConstant.map((bodily) => (
													<SelectItem
														value={bodily}
														key={bodily}
														className="hover:text-slate-900 text-slate-500"
													>
														{bodily}
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
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{field.value ||
													translation?.translations.medicalPayments}
											</SelectTrigger>
											<SelectContent
												side="bottom"
												className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
											>
												{medicalPaymentsConstant.map((medical) => (
													<SelectItem
														value={medical}
														key={medical}
														className="hover:text-slate-900 text-slate-500"
													>
														{medical}
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
							)}

							{/* Property Damage */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="propertyDamage">
									{translation?.translations.propertyDamage}
								</Label>
								<Switch
									checked={
										watchedCoverageOptions === "Liability Only"
											? true
											: propertyDamageEnabled
									}
									onCheckedChange={(value) =>
										watchedCoverageOptions === "Liability Only"
											? null
											: updateToggleState("propertyDamageEnabled", value)
									}
									disabled={watchedCoverageOptions === "Liability Only"}
								/>
							</div>

							{propertyDamageEnabled && (
								<Controller
									name={`alternativeOption.${currentIndex}.property_damage`}
									control={control}
									render={({ field, fieldState }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{field.value ||
													translation?.translations.propertyDamage}
											</SelectTrigger>
											<SelectContent
												side="bottom"
												className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
											>
												{propertyDamageConstant.map((propertyDamage) => (
													<SelectItem
														value={propertyDamage}
														key={propertyDamage}
														className="hover:text-slate-900 text-slate-500"
													>
														{propertyDamage}
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
											checked={field.value}
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
											checked={field.value}
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
											checked={field.value}
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
