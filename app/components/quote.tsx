import DownloadButton from "@/components/download-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { languages } from "@/lib/languages";
import type { Languages } from "@/lib/types";
import { CarIcon, CheckIcon, MapPin, Phone, User, X } from "lucide-react";
import type { QuoteFormSchema } from "./schemas";

export default function Quote({
	data,
	selectedLanguage,
}: { data: QuoteFormSchema; selectedLanguage: Languages }) {
	// Calculate total payments with proper null/undefined handling
	const baseFirstPayment =
		data.paymentAmounts?.paymentAmounts?.firstPayment ?? 0;
	const baseMonthlyPayment =
		data.paymentAmounts?.paymentAmounts?.monthlyPayment ?? 0;

	const rentersFirst =
		data.rentersInsurance?.optedIn && data.rentersInsurance?.firstPayment
			? data.rentersInsurance.firstPayment
			: 0;
	const rentersMonthly =
		data.rentersInsurance?.optedIn && data.rentersInsurance?.monthlyPayment
			? data.rentersInsurance.monthlyPayment
			: 0;
	const feeAmount =
		data.fee?.optedIn && data.fee?.value ? Number.parseInt(data.fee.value) : 0;

	const totalFirstPayment = baseFirstPayment + rentersFirst + feeAmount;
	const totalMonthlyPayment = baseMonthlyPayment + rentersMonthly;
	const annualPremium =
		totalFirstPayment +
		totalMonthlyPayment * (Number.parseInt(data.months) - 1);

	const translation = languages[selectedLanguage];

	const CoverageItem = ({
		label,
		included,
		value,
	}: { label: string; included: boolean; value?: string }) => (
		<div className="flex items-center gap-2.5 text-sm py-1">
			{included ? (
				<div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
					<CheckIcon className="h-3.5 w-3.5 text-green-600" />
				</div>
			) : (
				<div className="flex-shrink-0 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
					<X className="h-3.5 w-3.5 text-slate-400" />
				</div>
			)}
			<span
				className={included ? "text-slate-800 font-medium" : "text-slate-400"}
			>
				{label}
				{value && included && (
					<span className="ml-1 text-slate-600">{`: ${value}`}</span>
				)}
			</span>
		</div>
	);

	const VehicleCard = ({
		vehicle,
		isAlternative = false,
	}: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		vehicle: any;
		isAlternative?: boolean;
	}) => (
		<Card className="mb-5 border-none rounded-[8px] shadow-sm hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-3 bg-slate-50 rounded-t-[8px] border-b border-slate-100">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="bg-slate-700 text-white p-1.5 rounded-[8px]">
							<CarIcon className="h-4 w-4" />
						</div>
						<h3 className="text-lg font-semibold text-slate-800">
							{vehicle.name || "Unnamed Vehicle"}
						</h3>
					</div>
					<div className="flex gap-2">
						{vehicle.coverageOpt && (
							<span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 shadow-sm">
								{vehicle.coverageOpt}
							</span>
						)}
						{!vehicle.coverageOpt && (
							<span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200 shadow-sm">
								{translation.liabilityOnly}
							</span>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-4 px-5 pb-5">
				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-1.5 bg-slate-50 p-3 rounded-[8px]">
						<h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
							{translation.coverageOptions}
						</h4>
						<CoverageItem
							label={translation.bodilyInjury}
							included={vehicle.bodilyInjury?.optedIn ?? false}
							value={vehicle.bodilyInjury?.value}
						/>
						<CoverageItem
							label={translation.medicalPayments}
							included={vehicle.medicalPayments?.optedIn ?? false}
							value={vehicle.medicalPayments?.value}
						/>
						<CoverageItem
							label={translation.propertyDamage}
							included={vehicle.propertyDamage?.optedIn ?? false}
							value={vehicle.propertyDamage?.value}
						/>
					</div>
					<div className="space-y-1.5 bg-slate-50 p-3 rounded-[8px]">
						<h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
							Add-ons
						</h4>
						{vehicle.deductible?.optedIn && vehicle.deductible?.value && (
							<CoverageItem
								label={translation.deductible}
								included={true}
								value={`$${vehicle.deductible.value}`}
							/>
						)}
						<CoverageItem
							label={translation.rentalCar}
							included={vehicle.rentalCarCoverage ?? false}
						/>
						<CoverageItem
							label={translation.gapInsurance}
							included={vehicle.gapInsurance ?? false}
						/>
						{vehicle.extraCoverage !== undefined && (
							<CoverageItem
								label={translation.extraCoverage}
								included={vehicle.extraCoverage}
							/>
						)}
					</div>
				</div>

				{isAlternative &&
					"paymentAmounts" in vehicle &&
					vehicle.paymentAmounts && (
						<div className="mt-5 pt-4 border-t border-slate-200">
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-slate-100 p-3 rounded-[8px]">
									<span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
										{translation.firstPayment}
									</span>
									<div className="font-bold text-slate-800 text-lg mt-1">
										${vehicle.paymentAmounts.firstPayment.toFixed(2)}
									</div>
								</div>
								<div className="bg-slate-100 p-3 rounded-[8px]">
									<span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
										{translation.monthlyPayment}
									</span>
									<div className="font-bold text-slate-800 text-lg mt-1">
										${vehicle.paymentAmounts.monthlyPayment.toFixed(2)}
									</div>
								</div>
							</div>

							{vehicle.fullPayment?.optedIn &&
								vehicle.fullPayment?.paymentAmount && (
									<div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-[8px]">
										<div className="flex justify-between items-center">
											<span className="text-xs uppercase tracking-wider text-green-700 font-semibold">
												{translation.fullPayment}
											</span>
											<div className="font-bold text-green-700 text-lg">
												${vehicle.fullPayment.paymentAmount.toFixed(2)}
											</div>
										</div>
									</div>
								)}
						</div>
					)}
			</CardContent>
		</Card>
	);

	return (
		<div className="space-y-4">
			<div
				className="max-w-4xl mx-auto rounded-[8px] bg-white shadow-xl overflow-hidden"
				id="insurance-quote"
			>
				{/* Header - Removido gradiente problemático */}
				<div className="bg-slate-700 text-white p-7">
					<div className="flex justify-between items-start">
						<div>
							<div className="flex items-center gap-3 mb-5">
								<div className="bg-white p-2 rounded-[8px] shadow-md">
									<CarIcon className="h-6 w-6 text-slate-700" />
								</div>
								<h1 className="text-2xl font-bold tracking-tight">
									Insurance Quote
								</h1>
							</div>

							<div className="space-y-3 text-sm">
								{data.quoteNumber && (
									<div className="flex items-center gap-2.5 bg-slate-600 bg-opacity-30 px-3 py-2 rounded-[8px]">
										<MapPin className="h-4 w-4 text-slate-300" />
										<span className="text-slate-100">
											{translation.newQuote} #{data.quoteNumber}
										</span>
									</div>
								)}
								<div className="flex items-center gap-2.5 bg-slate-600 bg-opacity-30 px-3 py-2 rounded-[8px]">
									<User className="h-4 w-4 text-slate-300" />
									<span className="text-slate-100">
										{translation.agentName}: {data.agent}
									</span>
								</div>
								<div className="flex items-center gap-2.5 bg-slate-600 bg-opacity-30 px-3 py-2 rounded-[8px]">
									<Phone className="h-4 w-4 text-slate-300" />
									<span className="text-slate-100">
										{translation.csrName}: {data.csr}
									</span>
								</div>
							</div>
						</div>

						<div className="text-right">
							<div className="bg-white text-slate-800 px-5 py-3 rounded-[8px] shadow-lg font-bold">
								{data.carrier}
							</div>
						</div>
					</div>
				</div>

				<div className="p-7">
					{/* Client Information */}
					<div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-5 rounded-lg border border-slate-100">
						<div>
							<h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
								{translation.clientName}
							</h2>
							<p className="text-xl font-bold text-slate-800">
								{data.clientName}
							</p>
						</div>
						<div>
							<h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
								{translation.insuranceTypeLabel}
							</h2>
							<p className="text-xl font-bold text-slate-800">
								{data.InsuranceType}
							</p>
						</div>
						<div>
							<h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
								{translation.policyTerm}
							</h2>
							<p className="text-xl font-bold text-slate-800">
								{data.months} {translation.months}
							</p>
						</div>
						<div>
							<h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
								{translation.vehicles}
							</h2>
							<p className="text-xl font-bold text-slate-800">
								{data.vehicles?.length ?? 0}
							</p>
						</div>
					</div>

					{/* Coverage Details */}
					{data.vehicles && data.vehicles.length > 0 && (
						<div className="mb-10">
							<h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
								<span className="bg-slate-700 text-white w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
									1
								</span>
								{translation.mainCoverage}
							</h2>
							{data.vehicles.map((vehicle, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<VehicleCard key={index} vehicle={vehicle} />
							))}
						</div>
					)}

					{/* Alternative Options */}
					{data.alternativeOption &&
						data.alternativeOption.length > 0 &&
						data.alternativeOption[0]?.name?.length > 0 && (
							<div className="mb-10">
								<h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
									<span className="bg-slate-700 text-white w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
										2
									</span>
									{translation.alternativeOptions}
								</h2>
								{data.alternativeOption.map((vehicle, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<VehicleCard
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										vehicle={vehicle}
										isAlternative={true}
									/>
								))}
							</div>
						)}

					{/* Additional Coverage */}
					{(data.rentersInsurance?.optedIn || data.fee?.optedIn) && (
						<div className="mb-10">
							<h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
								<span className="bg-slate-700 text-white w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
									3
								</span>
								Additional Coverage & Fees
							</h2>
							<Card className="border-none rounded-lg shadow-sm">
								<CardContent className="p-5">
									<div className="space-y-4">
										{data.rentersInsurance?.optedIn && (
											<div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
												<div className="flex items-center gap-3">
													<div className="bg-blue-100 p-2 rounded-md">
														<CheckIcon className="h-4 w-4 text-blue-600" />
													</div>
													<span className="text-slate-700 font-medium">
														{translation.rentersInsurance}
													</span>
												</div>
												<span className="text-slate-900 font-bold bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
													${data.rentersInsurance.firstPayment ?? 0}{" "}
													{translation.firstPayment}, $
													{data.rentersInsurance.monthlyPayment ?? 0}{" "}
													{translation.monthlyPayment}
												</span>
											</div>
										)}
										{data.fee?.optedIn && data.fee?.value && (
											<div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
												<div className="flex items-center gap-3">
													<div className="bg-amber-100 p-2 rounded-md">
														<CheckIcon className="h-4 w-4 text-amber-600" />
													</div>
													<span className="text-slate-700 font-medium">
														{translation.addFee}
													</span>
												</div>
												<span className="text-slate-900 font-bold bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
													${data.fee.value}
												</span>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Full Payment Option */}
					{data.paymentAmounts?.fullPayment?.optedIn &&
						data.paymentAmounts?.fullPayment?.paymentAmount && (
							<div className="mb-10">
								<h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
									<span className="bg-green-600 text-white w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
										$
									</span>
									{translation.fullPayment}
								</h2>
								<Card className="border-none rounded-[8px] shadow-sm bg-green-50">
									<CardContent className="p-5">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-3">
												<div className="bg-green-200 p-2 rounded-md">
													<CheckIcon className="h-5 w-5 text-green-700" />
												</div>
												<span className="text-green-800 font-medium text-lg">
													Pay in Full (with fee only)
												</span>
											</div>
											<span className="text-2xl font-bold text-green-700 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-md">
												$
												{(
													data.paymentAmounts.fullPayment.paymentAmount +
													feeAmount
												).toFixed(2)}
											</span>
										</div>
									</CardContent>
								</Card>
							</div>
						)}

					{/* Payment Summary - Removido gradientes problemáticos */}
					<div>
						<h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
							<span className="bg-slate-700 text-white w-7 h-7 inline-flex items-center justify-center rounded-full mr-2 text-sm">
								$
							</span>
							{translation.paymentAmounts}
						</h2>
						<div className="grid grid-cols-3 gap-5">
							<Card className="border-none rounded-[8px] shadow-md bg-slate-50 overflow-hidden">
								<div className="h-2 bg-blue-500" />
								<CardContent className="pt-5 pb-6 text-center px-4">
									<div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
										{translation.firstPayment}
									</div>
									<div className="text-3xl font-bold text-slate-800">
										${totalFirstPayment.toFixed(2)}
									</div>
								</CardContent>
							</Card>

							<Card className="border-none rounded-[8px] shadow-md bg-slate-50 overflow-hidden">
								<div className="h-2 bg-slate-500" />
								<CardContent className="pt-5 pb-6 text-center px-4">
									<div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
										{Number.parseInt(data.months) - 1}{" "}
										{translation.monthlyPayment}
									</div>
									<div className="text-3xl font-bold text-slate-800">
										${totalMonthlyPayment.toFixed(2)}
									</div>
								</CardContent>
							</Card>

							<Card className="border-none rounded-lg shadow-md bg-slate-50 overflow-hidden">
								<div className="h-2 bg-green-500" />
								<CardContent className="pt-5 pb-6 text-center px-4">
									<div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
										{translation.fullPayment}
									</div>
									<div className="text-3xl font-bold text-slate-800">
										${annualPremium.toFixed(2)}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<DownloadButton
				elementId="insurance-quote"
				quoteNumber={data.quoteNumber}
			/>
		</div>
	);
}
