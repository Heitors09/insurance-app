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
import type { FormSchema } from "../schemas";

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

	const watchedVehicleName = watch(`vehicles.${currentIndex}.name`);
	const watchedCoverageOptions = watch(
		`vehicles.${currentIndex}.coverage_options`,
	);

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
		if (!vehicleToggleStates[currentIndex]) {
			setVehicleToggleStates((prev) => ({
				...prev,
				[currentIndex]: {
					deductibleEnabled: false,
					bodilyInjuryEnabled: false,
					medicalPaymentsEnabled: false,
					propertyDamageEnabled: false,
				},
			}));
		}
	}, [currentIndex, vehicleToggleStates]);

	// Auto-enable coverage options when Full Coverage is selected
	useEffect(() => {
		if (watchedCoverageOptions === "Full Coverage") {
			setVehicleToggleStates((prev) => ({
				...prev,
				[currentIndex]: {
					...prev[currentIndex],
					deductibleEnabled: true,
					bodilyInjuryEnabled: true,
					propertyDamageEnabled: true,
					// Keep medical payments as is - user can decide
				},
			}));
		} else if (watchedCoverageOptions === "Liability Only") {
			setVehicleToggleStates((prev) => ({
				...prev,
				[currentIndex]: {
					...prev[currentIndex],
					deductibleEnabled: false,
					bodilyInjuryEnabled: true,
					propertyDamageEnabled: true,
					// Keep medical payments as is - it can be added to liability
				},
			}));
		}
	}, [watchedCoverageOptions, currentIndex]);

	console.log(fields);

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
		// Initialize toggle states for new vehicle
		setVehicleToggleStates((prev) => ({
			...prev,
			[newIndex]: {
				deductibleEnabled: false,
				bodilyInjuryEnabled: false,
				medicalPaymentsEnabled: false,
				propertyDamageEnabled: false,
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
					const vehicleName =
						index === currentIndex ? watchedVehicleName : field.name;

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
							<Controller
								name={`vehicles.${currentIndex}.coverage_options`}
								control={control}
								render={({ field: { onChange } }) => (
									<Button
										type="button"
										variant={
											watchedCoverageOptions === "Full Coverage"
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
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
											{field.value || translation?.translations.bodilyInjury}
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
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{field.value || translation?.translations.medicalPayments}
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
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{field.value || translation?.translations.propertyDamage}
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
