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
import { Plus, Shield, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { FormSchema } from "../schemas";

const bodilyInjuryConstant = [
	"$35,000 / $80,000",
	"$50,000 / $100,000",
	"$100,000 / $300,000",
] as const;

const medicalPaymentsConstant = [
	"$5,000",
	"$10,000",
	"$15,000",
	"$25,000",
] as const;

const propertyDamageConstant = [
	"$50,000",
	"$100,000",
	"$150,000",
	"$250,000",
] as const;

type ToggleState = {
	deductibleEnabled: boolean;
	bodilyInjuryEnabled: boolean;
	medicalPaymentsEnabled: boolean;
	propertyDamageEnabled: boolean;
};

export const VehicleForm = () => {
	const translation = useContext(LanguageContext);
	const { control, watch, setValue } = useFormContext<FormSchema>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "vehicles",
	});

	const [currentIndex, setCurrentIndex] = useState(0);
	const [vehicleToggleStates, setVehicleToggleStates] = useState<{
		[vehicleIndex: number]: {
			deductibleEnabled: boolean;
			bodilyInjuryEnabled: boolean;
			medicalPaymentsEnabled: boolean;
			propertyDamageEnabled: boolean;
		};
	}>({});

	// Observar todos os valores dos veículos
	const vehicleNames = fields.map((_, index) =>
		watch(`vehicles.${index}.name`),
	);
	const vehicleDeductibles = fields.map((_, index) =>
		watch(`vehicles.${index}.deductible`),
	);
	const vehicleBodilyInjuries = fields.map((_, index) =>
		watch(`vehicles.${index}.bodily_injury`),
	);
	const vehicleMedicalPayments = fields.map((_, index) =>
		watch(`vehicles.${index}.medical_payments`),
	);
	const vehiclePropertyDamages = fields.map((_, index) =>
		watch(`vehicles.${index}.property_damage`),
	);
	const vehicleCoverageOptions = fields.map((_, index) =>
		watch(`vehicles.${index}.coverage_options`),
	);
	const watchedRentalCar = watch(
		`vehicles.${currentIndex}.rental_car_coverage`,
	);
	const watchedGapInsurance = watch(`vehicles.${currentIndex}.gap_insurance`);
	const watchedExtraCoverage = watch(`vehicles.${currentIndex}.extra_coverage`);

	// Get current vehicle's toggle states
	const currentVehicleStates = vehicleToggleStates[currentIndex] || {
		deductibleEnabled: false,
		bodilyInjuryEnabled: false,
		medicalPaymentsEnabled: false,
		propertyDamageEnabled: false,
	};

	const {
		deductibleEnabled,
		bodilyInjuryEnabled,
		medicalPaymentsEnabled,
		propertyDamageEnabled,
	} = currentVehicleStates;

	// Helper functions to update individual toggle states
	const updateToggleState = (
		field: keyof typeof currentVehicleStates,
		value: boolean,
	) => {
		setVehicleToggleStates((prev) => ({
			...prev,
			[currentIndex]: {
				...prev[currentIndex],
				[field]: value,
			},
		}));
	};

	// Initialize toggle states for existing vehicles when currentIndex changes
	useEffect(() => {
		const currentVehicle = fields[currentIndex];
		if (currentVehicle) {
			const newState = {
				deductibleEnabled: !!currentVehicle.deductible,
				bodilyInjuryEnabled: !!currentVehicle.bodily_injury,
				medicalPaymentsEnabled: !!currentVehicle.medical_payments,
				propertyDamageEnabled: !!currentVehicle.property_damage,
			};

			setVehicleToggleStates((prev) => {
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

	// Auto-enable coverage options when Full Coverage is selected
	useEffect(() => {
		const currentCoverageOption = vehicleCoverageOptions[currentIndex];
		if (currentCoverageOption === "Full Coverage") {
			const newState = {
				...currentVehicleStates,
				deductibleEnabled: true,
				bodilyInjuryEnabled: true,
				propertyDamageEnabled: true,
			};

			setVehicleToggleStates((prev) => {
				if (JSON.stringify(prev[currentIndex]) === JSON.stringify(newState)) {
					return prev;
				}
				return {
					...prev,
					[currentIndex]: newState,
				};
			});
		} else if (currentCoverageOption === "Liability Only") {
			const newState = {
				...currentVehicleStates,
				deductibleEnabled: false,
				bodilyInjuryEnabled: true,
				propertyDamageEnabled: true,
			};

			setVehicleToggleStates((prev) => {
				if (JSON.stringify(prev[currentIndex]) === JSON.stringify(newState)) {
					return prev;
				}
				return {
					...prev,
					[currentIndex]: newState,
				};
			});
		}
	}, [vehicleCoverageOptions, currentIndex, currentVehicleStates]);

	// Atualizar os valores dos campos de cobertura adicional quando mudar de veículo
	useEffect(() => {
		const currentVehicle = fields[currentIndex];
		if (currentVehicle) {
			setValue(
				`vehicles.${currentIndex}.rental_car_coverage`,
				currentVehicle.rental_car_coverage,
			);
			setValue(
				`vehicles.${currentIndex}.gap_insurance`,
				currentVehicle.gap_insurance,
			);
			setValue(
				`vehicles.${currentIndex}.extra_coverage`,
				currentVehicle.extra_coverage,
			);
		}
	}, [currentIndex, fields, setValue]);

	const addVehicle = () => {
		append({
			name: "new vehicle",
			bodily_injury: "$35,000 / $80,000",
			deductible: "$500",
			medical_payments: "$5,000",
			property_damage: "$100,000",
			rental_car_coverage: false,
			gap_insurance: false,
			extra_coverage: false,
			coverage_options: "Liability Only",
		});
		const newIndex = fields.length;
		setCurrentIndex(newIndex);
		setVehicleToggleStates((prev) => ({
			...prev,
			[newIndex]: {
				deductibleEnabled: false,
				bodilyInjuryEnabled: true,
				medicalPaymentsEnabled: false,
				propertyDamageEnabled: true,
			},
		}));
	};

	const removeVehicle = (index: number) => {
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
			<div className="w-full flex  justify-between">
				<Label>{translation?.translations.vehicles}</Label>
				<Button
					onClick={addVehicle}
					type="button"
					variant={"default"}
					className=""
				>
					<Plus size={16} className="mr-1" />
					{translation?.translations.addVehicle}
				</Button>
			</div>

			<div className="flex flex-wrap gap-2">
				{fields.map((field, index) => {
					const vehicleName = vehicleNames[index];

					return (
						<div key={field.id} className="relative">
							<Badge
								className={`cursor-pointer text-sm transition-all duration-200 ${
									index === currentIndex
										? "bg-blue-600 hover:bg-blue-700 text-white shadow-md ring-2 ring-blue-200"
										: "bg-gray-200 hover:bg-gray-300 text-gray-700"
								}`}
								onClick={() => setCurrentIndex(index)}
							>
								{vehicleName || `Vehicle ${index + 1}`}
								<button
									type="button"
									className={`ml-2 cursor-pointer transition-colors ${
										index === currentIndex
											? "text-blue-200 hover:text-white"
											: "text-gray-400 hover:text-gray-600"
									}`}
									onClick={(e) => {
										e.stopPropagation();
										removeVehicle(index);
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
				<>
					<div className="space-y-4">
						<Label className="flex items-center" htmlFor="name">
							{translation?.translations.vehicleName}
						</Label>
						<Controller
							name={`vehicles.${currentIndex}.name`}
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										id={`vehicles.${currentIndex}.name`}
										{...field}
										placeholder={translation?.translations.enterVehicleName}
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
							{translation?.translations.coverageOptions}
						</Label>

						<div className="flex gap-4">
							<Controller
								name={`vehicles.${currentIndex}.coverage_options`}
								control={control}
								render={({ field: { onChange } }) => (
									<Button
										type="button"
										variant={
											vehicleCoverageOptions[currentIndex] === "Liability Only"
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
							<Controller
								name={`vehicles.${currentIndex}.coverage_options`}
								control={control}
								render={({ field: { onChange } }) => (
									<Button
										type="button"
										variant={
											vehicleCoverageOptions[currentIndex] === "Full Coverage"
												? "default"
												: "secondary"
										}
										onClick={() => onChange("Full Coverage")}
									>
										<Shield size={16} className="mr-1" />
										{translation?.translations.fullCoverage}
									</Button>
								)}
							/>
						</div>
						<div className="space-y-4">
							{/* Vehicle Deductible */}
							<div className="w-full flex items-center justify-between">
								<Label className="flex items-center" htmlFor="deductible">
									{translation?.translations.deductible}
								</Label>
								<Switch
									checked={deductibleEnabled}
									onCheckedChange={(value) =>
										updateToggleState("deductibleEnabled", value)
									}
								/>
							</div>
							{deductibleEnabled && (
								<Controller
									name={`vehicles.${currentIndex}.deductible`}
									control={control}
									render={({ field, fieldState }) => (
										<div>
											<RadioGroup
												value={
													vehicleDeductibles[currentIndex] as "$500" | "$1000"
												}
												onValueChange={(value: "$500" | "$1000") => {
													field.onChange(value);
													setValue(
														`vehicles.${currentIndex}.deductible`,
														value,
													);
												}}
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
						</div>
					</div>

					<div className="space-y-4">
						{/* Vehicle Bodily Injury */}
						<div className="w-full flex items-center justify-between">
							<Label className="flex items-center" htmlFor="bodilyInjury">
								{translation?.translations.bodilyInjury}
							</Label>
							<Switch
								checked={bodilyInjuryEnabled}
								onCheckedChange={(value) =>
									updateToggleState("bodilyInjuryEnabled", value)
								}
							/>
						</div>

						{bodilyInjuryEnabled && (
							<Controller
								name={`vehicles.${currentIndex}.bodily_injury`}
								control={control}
								render={({ field, fieldState }) => (
									<Select
										value={
											vehicleBodilyInjuries[
												currentIndex
											] as (typeof bodilyInjuryConstant)[number]
										}
										onValueChange={(
											value: (typeof bodilyInjuryConstant)[number],
										) => {
											field.onChange(value);
											setValue(`vehicles.${currentIndex}.bodily_injury`, value);
										}}
									>
										<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
											{vehicleBodilyInjuries[currentIndex] ||
												translation?.translations.bodilyInjury}
										</SelectTrigger>
										<SelectContent
											side="bottom"
											className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
										>
											{bodilyInjuryConstant.map((bodily, index) => (
												<SelectItem
													value={bodily}
													// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
													key={index}
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
					</div>
					{/* Vehicle Medical Payments */}
					<div className="w-full flex items-center justify-between">
						<Label className="flex items-center" htmlFor="medicalPayments">
							{translation?.translations.medicalPayments}
						</Label>
						<Switch
							checked={medicalPaymentsEnabled}
							onCheckedChange={(value) =>
								updateToggleState("medicalPaymentsEnabled", value)
							}
						/>
					</div>

					{medicalPaymentsEnabled && (
						<Controller
							name={`vehicles.${currentIndex}.medical_payments`}
							control={control}
							render={({ field, fieldState }) => (
								<Select
									value={
										vehicleMedicalPayments[
											currentIndex
										] as (typeof medicalPaymentsConstant)[number]
									}
									onValueChange={(
										value: (typeof medicalPaymentsConstant)[number],
									) => {
										field.onChange(value);
										setValue(
											`vehicles.${currentIndex}.medical_payments`,
											value,
										);
									}}
								>
									<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{vehicleMedicalPayments[currentIndex] ||
											translation?.translations.medicalPayments}
									</SelectTrigger>
									<SelectContent
										side="bottom"
										className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
									>
										{medicalPaymentsConstant.map((medical, index) => (
											<SelectItem
												value={medical}
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												key={index}
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

					<div className="w-full flex items-center justify-between">
						<Label className="flex items-center" htmlFor="propertyDamage">
							{translation?.translations.propertyDamage}
						</Label>
						<Switch
							checked={propertyDamageEnabled}
							onCheckedChange={(value) =>
								updateToggleState("propertyDamageEnabled", value)
							}
						/>
					</div>

					{propertyDamageEnabled && (
						<Controller
							name={`vehicles.${currentIndex}.property_damage`}
							control={control}
							render={({ field, fieldState }) => (
								<Select
									value={
										vehiclePropertyDamages[
											currentIndex
										] as (typeof propertyDamageConstant)[number]
									}
									onValueChange={(
										value: (typeof propertyDamageConstant)[number],
									) => {
										field.onChange(value);
										setValue(`vehicles.${currentIndex}.property_damage`, value);
									}}
								>
									<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{vehiclePropertyDamages[currentIndex] ||
											translation?.translations.propertyDamage}
									</SelectTrigger>
									<SelectContent
										side="bottom"
										className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
									>
										{propertyDamageConstant.map((propertyDamage, index) => (
											<SelectItem
												value={propertyDamage}
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												key={index}
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
							name={`vehicles.${currentIndex}.rental_car_coverage`}
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
							name={`vehicles.${currentIndex}.gap_insurance`}
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
							name={`vehicles.${currentIndex}.extra_coverage`}
							control={control}
							render={({ field }) => (
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<h3 className="text-sm text-slate-500">
						{translation?.translations.addVehicle}
					</h3>
					<p className="text-sm text-slate-500">
						{translation?.translations.enterVehicleName}
					</p>
				</div>
			)}
		</>
	);
};
