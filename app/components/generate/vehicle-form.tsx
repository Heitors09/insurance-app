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
import { Plus, Shield } from "lucide-react";
import { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FormSchema } from "../schemas";

export const VehicleForm = () => {
	const { control, watch } = useFormContext<FormSchema>();
	//state and logic variables
	const translation = useContext(LanguageContext);
	const [currentVehicle, setCurrentVehicle] = useState(0);
	const [switchStates, setSwitchStates] = useState({
		deductible: false,
		bodilyInjury: false,
		medicalPayments: false,
		propertyDamage: false,
	});

	//watch variables

	const selectedCoverageOption = watch("vehicles.0.coverage_options");
	const vehicleName = watch("vehicles.0.name");

	//functions

	const toggleSwitch = (key: keyof typeof switchStates) => {
		setSwitchStates((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<>
			<div className="w-full flex  justify-between">
				<Label>{translation?.translations.vehicles}</Label>
				<Button type="button" variant={"default"} className="">
					<Plus size={16} className="mr-1" />
					{translation?.translations.addVehicle}
				</Button>
			</div>
			{vehicleName ? (
				<Badge variant={"default"}>{vehicleName}</Badge>
			) : (
				<Badge variant={"default"}>
					{translation?.translations.typeToAddAvehicle}
				</Badge>
			)}
			<div className="space-y-4">
				<Label className="flex items-center" htmlFor="name">
					{translation?.translations.vehicleName}
				</Label>
				<Controller
					name="vehicles.0.name"
					control={control}
					render={({ field, fieldState }) => (
						<>
							<Input
								id="vehicles.0.name"
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
						name="vehicles.0.coverage_options"
						control={control}
						render={({ field: { value, onChange } }) => (
							<Button
								type="button"
								variant={
									value === "Liability Only"
										? "secondary_selected"
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
						name="vehicles.0.coverage_options"
						control={control}
						render={({ field: { value, onChange } }) => (
							<Button
								type="button"
								variant={
									value === "Full Coverage" ? "secondary_selected" : "secondary"
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
							checked={
								selectedCoverageOption === "Full Coverage" ||
								switchStates.deductible === true
							}
							disabled={selectedCoverageOption === "Full Coverage"}
							onCheckedChange={() => toggleSwitch("deductible")}
						/>
					</div>

					{(switchStates.deductible ||
						selectedCoverageOption === "Full Coverage") && (
						<Controller
							name={"vehicles.0.deductible"}
							control={control}
							render={({ field, fieldState }) => (
								<div>
									<RadioGroup value={field.value}>
										<div className="flex gap-4">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="control" id="r1" />
												<Label htmlFor="r1">$500</Label>
											</div>
											<div className="flex items-center space-x-2">
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
				</div>
			</div>
			<div className="space-y-4">
				{/* Vehicle Bodily Injury */}
				<div className="w-full flex items-center justify-between">
					<Label className="flex items-center" htmlFor="bodilyInjury">
						{translation?.translations.bodilyInjury}
					</Label>
					<Switch
						checked={
							selectedCoverageOption !== undefined ||
							switchStates.bodilyInjury === true
						}
						disabled={selectedCoverageOption !== undefined}
						onCheckedChange={() => toggleSwitch("bodilyInjury")}
					/>
				</div>

				{(switchStates.bodilyInjury ||
					selectedCoverageOption !== undefined) && (
					<Controller
						name={"vehicles.0.bodily_injury"}
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
				<Switch onCheckedChange={() => toggleSwitch("medicalPayments")} />
			</div>

			{switchStates.medicalPayments && (
				<Controller
					name={"vehicles.0.medical_payments"}
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
					checked={
						selectedCoverageOption !== undefined ||
						switchStates.propertyDamage === true
					}
					disabled={selectedCoverageOption !== undefined}
					onCheckedChange={() => toggleSwitch("propertyDamage")}
				/>
			</div>

			{(switchStates.propertyDamage ||
				selectedCoverageOption !== undefined) && (
				<Controller
					name={"vehicles.0.property_damage"}
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
					name={"vehicles.0.rental_car_coverage"}
					control={control}
					render={({ field }) => (
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					)}
				/>
			</div>

			{/* Gap Insurance */}
			<div className="w-full flex items-center justify-between">
				<Label className="flex items-center" htmlFor="gapInsurance">
					{translation?.translations.gapInsurance}
				</Label>
				<Controller
					name={"vehicles.0.gap_insurance"}
					control={control}
					render={({ field }) => (
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					)}
				/>
			</div>

			{/* Extra Coverage */}
			<div className="w-full flex items-center justify-between">
				<Label className="flex items-center" htmlFor="extraCoverage">
					{translation?.translations.extraCoverage}
				</Label>
				<Controller
					name={"vehicles.0.extra_coverage"}
					control={control}
					render={({ field }) => (
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					)}
				/>
			</div>
		</>
	);
};
