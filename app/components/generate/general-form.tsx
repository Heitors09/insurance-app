import { LanguageContext } from "@/app/language-context";
import { Button } from "@/components/ui/button";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	fetchAgentNames,
	fetchCarrierOptions,
	fetchCsrOptions,
	supabase,
} from "@/lib/create";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash, Truck, User } from "lucide-react";
import { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { FormSchema } from "../schemas";

export const GeneralForm = () => {
	const translation = useContext(LanguageContext);
	const [showCustomOption, setShowCustomOption] = useState(false);
	const [showCustomCsrOption, setShowCustomCsrOption] = useState(false);
	const [showCustomCarrierOption, setShowCustomCarrierOption] = useState(false);
	const [customAgent, setCustomAgent] = useState("");
	const [customCsr, setCustomCsr] = useState("");
	const [customCarrier, setCustomCarrier] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { control } = useFormContext<FormSchema>();
	const queryClient = useQueryClient();

	const { data: agentNames, error } = useQuery({
		queryKey: ["agent-names"],
		queryFn: fetchAgentNames,
	});

	const { data: csrOptions, error: csrError } = useQuery({
		queryKey: ["csr-options"],
		queryFn: fetchCsrOptions,
	});

	const { data: carrierOptions, error: carrierError } = useQuery({
		queryKey: ["carrier-options"],
		queryFn: fetchCarrierOptions,
	});

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
				toast.error(`${value} already exists`);
				return;
			}

			if (option === "agent_names") {
				await queryClient.invalidateQueries({ queryKey: ["agent-names"] });
				setCustomAgent("");
				setShowCustomOption(false);
			} else if (option === "csr") {
				await queryClient.invalidateQueries({ queryKey: ["csr-options"] });
				setCustomCsr("");
				setShowCustomCsrOption(false);
			} else if (option === "carriers") {
				await queryClient.invalidateQueries({ queryKey: ["carrier-options"] });
				setCustomCarrier("");
				setShowCustomCarrierOption(false);
			}
		} catch (error) {
			console.error("Erro ao inserir:", error);
		}
	};
	//option is table name
	//name is column name
	//value is value to delete
	const handleDeleteValue = async (
		option: string,
		name: string,
		value: string,
		onSuccess?: () => void,
	) => {
		setIsLoading(true);
		try {
			const { error } = await supabase.from(option).delete().eq(name, value);
			setIsLoading(false);
			toast.success(`${value} deleted successfully`);

			if (error) {
				toast.error("Error deleting value");
				return;
			}

			if (option === "agent_names") {
				await queryClient.invalidateQueries({ queryKey: ["agent-names"] });
			} else if (option === "csr") {
				await queryClient.invalidateQueries({ queryKey: ["csr-options"] });
			} else if (option === "carriers") {
				await queryClient.invalidateQueries({ queryKey: ["carrier-options"] });
			}

			// Chamar callback de sucesso para limpar o campo
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			toast.error("Error deleting value");
			console.error("Erro ao deletar:", error);
		}
	};

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
								value="Auto"
								className="hover:text-slate-900 text-slate-500"
							>
								{translation?.translations.autoInsuranceType}
							</SelectItem>
							<SelectSeparator className="bg-slate-300 mx-2" />
							<SelectItem
								value="Commercial Auto"
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
						<div className="flex items-center gap-2">
							<Controller
								name="agent_name"
								control={control}
								render={({ field, fieldState }) => (
									<>
										<Select
											value={field.value}
											onValueChange={(value) => {
												if (value === "customAgent") {
													setShowCustomOption(true);
												} else {
													setShowCustomOption(false);
													field.onChange(value);
												}
											}}
										>
											<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
												{field.value || translation?.translations.agentName}
											</SelectTrigger>
											<SelectContent className="w-[360px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
												{agentNames?.map((agent) => (
													<SelectItem
														value={agent.name}
														key={agent.id}
														className="hover:text-slate-900 text-slate-500"
													>
														<div className="flex items-center gap-2">
															<User size={14} />
															{agent.name}
														</div>
													</SelectItem>
												))}
												<SelectItem
													value="customAgent"
													className="hover:text-slate-900 text-slate-500 border-t border-slate-200"
												>
													<div className="flex items-center gap-2">
														<Plus size={14} />
														{translation?.translations.customAgent}
													</div>
												</SelectItem>
											</SelectContent>
											{fieldState.error && (
												<p className="text-red-500 text-sm mt-1">
													{fieldState.error.message}
												</p>
											)}
										</Select>
										{field.value && field.value !== "customAgent" && (
											<Tooltip>
												<TooltipTrigger>
													<div
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															handleDeleteValue(
																"agent_names",
																"name",
																field.value,
																() => {
																	field.onChange("");
																},
															);
														}}
														onKeyDown={(e) => {
															if (e.key === "Enter" || e.key === " ") {
																e.preventDefault();
																e.stopPropagation();
																handleDeleteValue(
																	"agent_names",
																	"name",
																	field.value,
																	() => {
																		field.onChange("");
																	},
																);
															}
														}}
														className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200 cursor-pointer"
													>
														<Trash size={16} />
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p>Delete {field.value}</p>
												</TooltipContent>
											</Tooltip>
										)}
									</>
								)}
							/>
						</div>

						{showCustomOption && (
							<div className="flex items-center gap-2">
								<Input
									id="custom_agent"
									onChange={(e) => setCustomAgent(e.target.value)}
									placeholder={translation?.translations.customAgent}
									className="ring-1 ring-slate-300 rounded-[8px] border-none"
								/>
								<Button
									type="button"
									variant="default"
									disabled={!customAgent || isLoading}
									onClick={() =>
										handleInsertNewCustomValue(
											"agent_names",
											customAgent,
											"name",
										)
									}
								>
									<Check size={14} />
								</Button>
							</div>
						)}
					</div>
				</div>
				<div className="w-full space-y-4">
					<Label className="flex items-center" htmlFor="name">
						{translation?.translations.csrName}
						<span className="text-orange-500">*</span>
					</Label>
					<div className="flex items-center gap-2">
						<Controller
							name="csr"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Select
										value={field.value}
										onValueChange={(value) => {
											if (value === "customCsr") {
												setShowCustomCsrOption(true);
											} else {
												setShowCustomCsrOption(false);
												field.onChange(value);
											}
										}}
									>
										<SelectTrigger className="ring-slate-300 ring-1 border-none rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
											{field.value || translation?.translations.csrName}
										</SelectTrigger>
										<SelectContent className="w-[360px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
											{csrOptions?.map((csr) => (
												<SelectItem
													value={csr.csr_names}
													key={csr.id}
													className="hover:text-slate-900 text-slate-500"
												>
													<div className="flex items-center gap-2">
														<User size={14} />
														{csr.csr_names}
													</div>
												</SelectItem>
											))}
											<SelectItem
												value="customCsr"
												className="hover:text-slate-900 text-slate-500 border-t border-slate-200"
											>
												<div className="flex items-center gap-2">
													<Plus size={14} />
													Custom CSR
												</div>
											</SelectItem>
										</SelectContent>
										{fieldState.error && (
											<p className="text-red-500 text-sm mt-1">
												{fieldState.error.message}
											</p>
										)}
									</Select>
									{field.value && field.value !== "customCsr" && (
										<Tooltip>
											<TooltipTrigger>
												<div
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														handleDeleteValue(
															"csr",
															"csr_names",
															field.value,
															() => {
																field.onChange("");
															},
														);
													}}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															e.stopPropagation();
															handleDeleteValue(
																"csr",
																"csr_names",
																field.value,
																() => {
																	field.onChange("");
																},
															);
														}
													}}
													className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200 cursor-pointer"
												>
													<Trash size={16} />
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>Delete {field.value}</p>
											</TooltipContent>
										</Tooltip>
									)}
								</>
							)}
						/>
					</div>
					{showCustomCsrOption && (
						<div className="flex items-center gap-2">
							<Input
								id="custom_csr"
								onChange={(e) => setCustomCsr(e.target.value)}
								placeholder="Custom CSR"
								className="ring-1 ring-slate-300 rounded-[8px] border-none"
							/>
							<Button
								type="button"
								variant="default"
								disabled={!customCsr || isLoading}
								onClick={() =>
									handleInsertNewCustomValue("csr", customCsr, "csr_names")
								}
							>
								<Check size={14} />
							</Button>
						</div>
					)}
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
				<div className="flex items-center gap-2">
					<Controller
						name="insurance_carrier"
						control={control}
						render={({ field, fieldState }) => (
							<>
								<Select
									value={field.value}
									onValueChange={(value) => {
										if (value === "customCarrier") {
											setShowCustomCarrierOption(true);
										} else {
											setShowCustomCarrierOption(false);
											field.onChange(value);
										}
									}}
								>
									<SelectTrigger className="ring-slate-300 border-none ring-1 rounded-[8px] w-full flex items-center justify-between text-sm px-4 py-2">
										{field.value || translation?.translations.carrier}
									</SelectTrigger>
									<SelectContent
										side="bottom"
										className="w-[736px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]"
									>
										{carrierOptions?.map((carrier) => (
											<SelectItem
												value={carrier.carrier_name}
												key={carrier.id}
												className="hover:text-slate-900 text-slate-500"
											>
												<div className="flex items-center gap-2">
													<Truck size={14} />
													{carrier.carrier_name}
												</div>
											</SelectItem>
										))}
										<SelectItem
											value="customCarrier"
											className="hover:text-slate-900 text-slate-500 border-t border-slate-200"
										>
											<div className="flex items-center gap-2">
												<Plus size={14} />
												Custom Carrier
											</div>
										</SelectItem>
									</SelectContent>
									{fieldState.error && (
										<p className="text-red-500 text-sm mt-1">
											{fieldState.error.message}
										</p>
									)}
								</Select>
								{field.value && field.value !== "customCarrier" && (
									<Tooltip>
										<TooltipTrigger>
											<div
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													handleDeleteValue(
														"carriers",
														"carrier_name",
														field.value,
														() => {
															field.onChange("");
														},
													);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														e.stopPropagation();
														handleDeleteValue(
															"carriers",
															"carrier_name",
															field.value,
															() => {
																field.onChange("");
															},
														);
													}
												}}
												className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200 cursor-pointer"
											>
												<Trash size={16} />
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Delete {field.value}</p>
										</TooltipContent>
									</Tooltip>
								)}
							</>
						)}
					/>
				</div>
				{showCustomCarrierOption && (
					<div className="flex items-center gap-2">
						<Input
							id="custom_carrier"
							onChange={(e) => setCustomCarrier(e.target.value)}
							placeholder={translation?.translations.customCarrier}
							className="ring-1 ring-slate-300 rounded-[8px] border-none"
						/>
						<Button
							type="button"
							variant="default"
							disabled={!customCarrier || isLoading}
							onClick={() =>
								handleInsertNewCustomValue(
									"carriers",
									customCarrier,
									"carrier_name",
								)
							}
						>
							<Check size={14} />
						</Button>
					</div>
				)}
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
