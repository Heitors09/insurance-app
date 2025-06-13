import { LanguageContext } from "@/app/language-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FormSchema } from "../schemas";

export default function PaymentForm() {
	const translation = useContext(LanguageContext);
	const { control, watch, setValue } = useFormContext<FormSchema>();
	const [switchStates, setSwitchStates] = useState({
		rentersInsurance: false,
		fee: false,
		fullPayment: false,
	});

	const toggleSwitch = (key: keyof typeof switchStates) => {
		setSwitchStates((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<div className="space-y-4">
			{/* Renters Insurance Section */}
			<div className="bg-white p-4 rounded-[8px] border border-slate-200">
				<div className="w-full flex items-center justify-between mb-2">
					<Label
						className="flex items-center text-sm font-medium text-slate-700"
						htmlFor="rentersInsurance"
					>
						{translation?.translations.rentersInsurance}
					</Label>
					<Switch
						checked={switchStates.rentersInsurance}
						onCheckedChange={() => toggleSwitch("rentersInsurance")}
					/>
				</div>

				{switchStates.rentersInsurance && (
					<div className="grid grid-cols-2 gap-4 mt-4">
						<div className="space-y-1.5">
							<Label
								htmlFor="renters_first_payment"
								className="text-sm text-slate-600"
							>
								{translation?.translations.rentersFirstPayment}
							</Label>
							<Controller
								name="renters_first_payment"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<Input
											id="renters_first_payment"
											{...field}
											placeholder={
												translation?.translations.rentersFirstPayment
											}
											className="ring-1 ring-slate-200 rounded-md border-none bg-slate-50 text-sm"
										/>
										{fieldState.error && (
											<p className="text-xs text-red-500 mt-1">
												{fieldState.error.message}
											</p>
										)}
									</>
								)}
							/>
						</div>

						<div className="space-y-1.5">
							<Label
								htmlFor="renters_monthly_payment"
								className="text-sm text-slate-600"
							>
								{translation?.translations.rentersMonthlyPayment}
							</Label>
							<Controller
								name="renters_monthly_payment"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<Input
											id="renters_monthly_payment"
											{...field}
											placeholder={
												translation?.translations.rentersMonthlyPayment
											}
											className="ring-1 ring-slate-200 rounded-md border-none bg-slate-50 text-sm"
										/>
										{fieldState.error && (
											<p className="text-xs text-red-500 mt-1">
												{fieldState.error.message}
											</p>
										)}
									</>
								)}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Fee Section */}
			<div className="bg-white p-4 rounded-[8px] border border-slate-200">
				<div className="w-full flex items-center justify-between mb-2">
					<Label
						className="flex items-center text-sm font-medium text-slate-700"
						htmlFor="fee"
					>
						{translation?.translations.addFee}
					</Label>
					<Switch
						checked={switchStates.fee}
						onCheckedChange={() => toggleSwitch("fee")}
					/>
				</div>

				{switchStates.fee && (
					<div className="space-y-1.5 mt-4">
						<Controller
							name="fee"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										id="fee"
										{...field}
										placeholder={translation?.translations.feeAmount}
										className="ring-1 ring-slate-200 rounded-md border-none bg-slate-50 text-sm"
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">
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
			<div className="bg-white p-4 rounded-[8px] border border-slate-200">
				<h3 className="text-sm font-semibold text-slate-900 mb-4">
					{translation?.translations.paymentAmounts}
				</h3>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label
							htmlFor="payment_amount_first_payment"
							className="text-sm text-slate-600"
						>
							{translation?.translations.firstPayment}
						</Label>
						<Controller
							name="payment_amount_first_payment"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										id="payment_amount_first_payment"
										{...field}
										placeholder={translation?.translations.firstPayment}
										className="ring-1 ring-slate-200 rounded-md border-none bg-slate-50 text-sm"
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">
											{fieldState.error.message}
										</p>
									)}
								</>
							)}
						/>
					</div>

					<div className="space-y-1.5">
						<Label
							htmlFor="payment_amount_monthly_payment"
							className="text-sm text-slate-600"
						>
							{translation?.translations.monthlyPayment}
						</Label>
						<Controller
							name="payment_amount_monthly_payment"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Input
										id="payment_amount_monthly_payment"
										{...field}
										placeholder={translation?.translations.monthlyPayment}
										className="ring-1 ring-slate-200 rounded-md border-none bg-slate-50 text-sm"
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">
											{fieldState.error.message}
										</p>
									)}
								</>
							)}
						/>
					</div>
				</div>

				<div className="space-y-3 pt-4 mt-4 border-t border-slate-200">
					<div className="w-full flex items-center justify-between">
						<Label
							className="flex items-center text-sm font-medium text-slate-700"
							htmlFor="fullPayment"
						>
							{translation?.translations.fullPayment}
						</Label>
						<Switch
							checked={switchStates.fullPayment}
							onCheckedChange={() => toggleSwitch("fullPayment")}
						/>
					</div>

					{switchStates.fullPayment && (
						<div className="space-y-1.5">
							<Controller
								name="full_payment"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<Input
											id="full_payment"
											{...field}
											placeholder={translation?.translations.fullPayment}
											className="ring-1 ring-slate-200 rounded-md border-none bg-slate-50 text-sm"
										/>
										{fieldState.error && (
											<p className="text-xs text-red-500 mt-1">
												{fieldState.error.message}
											</p>
										)}
									</>
								)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
