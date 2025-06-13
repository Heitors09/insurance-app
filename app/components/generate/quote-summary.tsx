import { LanguageContext } from "@/app/language-context";
import SaveQuoteButton from "@/components/save-button";
import { Badge } from "@/components/ui/badge";
import { toPng } from "html-to-image"; // @ts-ignore
import { Download } from "lucide-react";
import { useContext, useState } from "react";
import type { FormSchema } from "../schemas";

interface QuoteSummaryProps {
	data: FormSchema;
}

export function DownloadImageButton({
	elementId,
	fileName = "cotacao.png",
}: { elementId: string; fileName?: string }) {
	const [loading, setLoading] = useState(false);

	const handleDownload = async () => {
		setLoading(true);
		try {
			const element = document.getElementById(elementId);
			if (!element) {
				console.error(`Elemento com id '${elementId}' não encontrado no DOM.`);
				alert("Não foi possível encontrar a cotação na tela. Tente novamente.");
				setLoading(false);
				return;
			}

			// Aguardar as fontes carregarem
			await document.fonts.ready;

			console.log("Elemento encontrado, iniciando geração da imagem...");
			const dataUrl = await toPng(element, {
				cacheBust: true,
				backgroundColor: "#fff",
				quality: 1.0,
				pixelRatio: 2,
				skipFonts: true, // Ignorar fontes personalizadas
				style: {
					transform: "scale(1)",
					transformOrigin: "top left",
				},
			});

			console.log("Imagem gerada, iniciando download...");
			const link = document.createElement("a");
			link.download = fileName;
			link.href = dataUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (e) {
			console.error("Erro ao gerar a imagem:", e);
			alert(
				"Erro ao gerar a imagem. Tente novamente ou simplifique o conteúdo. Veja o console para detalhes.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleDownload}
			disabled={loading}
			type="button"
			className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-[8px] hover:bg-blue-800 transition disabled:opacity-60 w-full text-center"
		>
			<Download className="h-5 w-5" />
			{loading ? "Gerando imagem..." : "Baixar imagem"}
		</button>
	);
}

export default function QuoteSummary({ data }: QuoteSummaryProps) {
	const translation = useContext(LanguageContext)?.translations;

	// Cálculos principais
	const firstPayment = Number.parseFloat(
		data.payment_amount_first_payment || "0",
	);
	const monthlyPayment = Number.parseFloat(
		data.payment_amount_monthly_payment || "0",
	);
	const rentersFirst = Number.parseFloat(data.renters_first_payment || "0");
	const rentersMonthly = Number.parseFloat(data.renters_monthly_payment || "0");
	const fee = Number.parseFloat(data.fee || "0");
	const fullPayment = data.full_payment
		? Number.parseFloat(data.full_payment)
		: null;

	const totalFirstPayment = firstPayment + rentersFirst + fee;
	const totalMonthlyPayment = monthlyPayment + rentersMonthly;
	const totalFullPayment = fullPayment !== null ? fullPayment + fee : null;

	// Função para calcular os valores de cada alternative option
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function getAlternativePayments(option: any) {
		const first = Number.parseFloat(option.payment_amount_first_payment || "0");
		const monthly = Number.parseFloat(
			option.payment_amount_monthly_payment || "0",
		);
		const rentersFirst = Number.parseFloat(option.renters_first_payment || "0");
		const rentersMonthly = Number.parseFloat(
			option.renters_monthly_payment || "0",
		);
		const fee = Number.parseFloat(option.fee || "0");
		const full = option.full_payment
			? Number.parseFloat(option.full_payment)
			: null;
		return {
			totalFirst: first + rentersFirst + fee,
			totalMonthly: monthly + rentersMonthly,
			totalFull: full !== null ? full + fee : null,
		};
	}

	return (
		<div className="flex flex-col gap-4">
			<div
				className="w-full max-w-5xl mx-auto"
				id="quote-summary-export"
				style={{
					fontFamily: "Arial, Helvetica, sans-serif",
					color: "#222",
					background: "#fff",
					fontSize: "16px",
					lineHeight: 1.4,
					padding: "1rem",
				}}
			>
				{/* Header */}
				<div className="flex flex-col items-center gap-4 mb-10">
					<div className="flex-1 flex flex-col items-center">
						<h1
							style={{
								fontFamily: "Arial, Helvetica, sans-serif",
								fontWeight: 700,
								color: "#2563eb", // azul Tailwind
								fontSize: "2rem",
								marginBottom: "0.5rem",
								textAlign: "center",
							}}
						>
							<span className="text-blue-600 text-2xl mr-2">📄</span>
							{translation?.mainTitle || "Insurance Quote Generator"}
						</h1>
						<p className="text-slate-500 text-sm md:text-base mt-1 text-center">
							{translation?.generateQuote || "Quote"}
						</p>
					</div>
				</div>

				{/* Dados principais */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className="text-blue-500 text-lg">👤</span>
							<span className="font-semibold text-slate-700">
								{translation?.clientName}:
							</span>
							<span className="text-slate-900">{data.client_name}</span>
						</div>
						<div className="flex items-center gap-2">
							<Badge className="bg-blue-100 text-blue-700">
								{translation?.[
									data.type_of_insurance === "Auto"
										? "autoInsuranceType"
										: "commercialAutoInsuranceType"
								] || data.type_of_insurance}
							</Badge>
							<span className="text-slate-700">{data.insurance_carrier}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-semibold text-slate-700">
								{translation?.agentName}:
							</span>
							<span className="text-slate-900">{data.agent_name}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-semibold text-slate-700">
								{translation?.csrName}:
							</span>
							<span className="text-slate-900">{data.csr}</span>
						</div>
					</div>
					<div className="flex flex-col items-end justify-end gap-2">
						<span className="text-blue-200 text-3xl mb-2">🚗</span>
						<span className="text-blue-700 font-bold text-xl">
							{data.vehicles.length} {translation?.vehicles}
						</span>
						<span className="text-slate-500 text-sm">{data.policy_term}</span>
					</div>
				</div>

				{/* Cobertura Principal e Alternativas */}
				<div className="mb-10 flex flex-col gap-10">
					{/* Principal */}
					<div className="bg-white border border-slate-200 rounded-[16px] p-8 min-h-[340px] flex flex-col">
						<div className="flex items-center gap-3 mb-6">
							<span className="text-blue-600 text-xl">🛡️</span>
							<span className="text-xl font-semibold text-slate-800">
								{translation?.mainCoverage || "Main Coverage"}
							</span>
						</div>
						<div className="flex-1">
							{data.vehicles.map((vehicle, idx) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={idx}
									className="mb-6 last:mb-0 bg-white border border-slate-200 rounded-[12px] p-6"
								>
									<div className="flex items-center gap-3 mb-3">
										<span className="font-semibold text-blue-700 text-lg">
											{vehicle.name}
										</span>
										<Badge className="bg-blue-100 text-blue-700 px-3 py-1">
											{translation?.[
												vehicle.coverage_options === "Full Coverage"
													? "fullCoverage"
													: "liabilityOnly"
											] || vehicle.coverage_options}
										</Badge>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
										<span className="flex items-center gap-2 text-green-600 font-medium">
											<span className="text-blue-400">✔️</span>
											{translation?.deductible}: {vehicle.deductible}
										</span>
										<span className="flex items-center gap-2 text-slate-700">
											<span className="text-blue-400">✔️</span>
											{translation?.bodilyInjury}: {vehicle.bodily_injury}
										</span>
										<span className="flex items-center gap-2 text-slate-700">
											<span className="text-blue-400">✔️</span>
											{translation?.propertyDamage}: {vehicle.property_damage}
										</span>
										<span className="flex items-center gap-2 text-slate-700">
											<span className="text-blue-400">✔️</span>
											{translation?.medicalPayments}: {vehicle.medical_payments}
										</span>
									</div>
									<div className="flex flex-wrap gap-2">
										{vehicle.rental_car_coverage && (
											<Badge className="bg-purple-100 text-purple-700 px-3">
												{translation?.rentalCar}
											</Badge>
										)}
										{vehicle.gap_insurance && (
											<Badge className="bg-purple-100 text-purple-700 px-3">
												{translation?.gapInsurance}
											</Badge>
										)}
										{vehicle.extra_coverage && (
											<Badge className="bg-purple-100 text-purple-700 px-3">
												{translation?.extraCoverage}
											</Badge>
										)}
									</div>
								</div>
							))}
						</div>
						{/* Valores principais */}
						<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
							<div className="bg-white border border-blue-200 rounded-[12px] p-6 flex flex-col items-center">
								<span className="text-sm text-blue-700 font-medium mb-2">
									{translation?.firstPayment}
								</span>
								<span className="text-3xl font-bold text-blue-700">
									R$ {totalFirstPayment.toFixed(2)}
								</span>
							</div>
							<div className="bg-white border border-blue-200 rounded-[12px] p-6 flex flex-col items-center">
								<span className="text-sm text-blue-700 font-medium mb-2">
									{translation?.monthlyPayment}
								</span>
								<span className="text-3xl font-bold text-blue-700">
									R$ {totalMonthlyPayment.toFixed(2)}
								</span>
							</div>
							{totalFullPayment !== null && (
								<div className="bg-white border border-blue-200 rounded-[12px] p-6 flex flex-col items-center">
									<span className="text-sm text-blue-700 font-medium mb-2">
										{translation?.fullPayment}
									</span>
									<span className="text-3xl font-bold text-blue-700">
										R$ {totalFullPayment.toFixed(2)}
									</span>
								</div>
							)}
						</div>
					</div>
					{/* Alternativas */}
					{Array.isArray(data.alternativeOption) &&
						data.alternativeOption.length > 0 && (
							<div className="bg-white border border-slate-200 rounded-[16px] p-8 min-h-[340px] flex flex-col">
								<div className="flex items-center gap-3 mb-6">
									<span className="text-purple-600 text-xl">🛡️</span>
									<span className="text-xl font-semibold text-slate-800">
										{translation?.alternativeOptions || "Alternative Options"}
									</span>
								</div>
								<div className="flex-1">
									{data.alternativeOption.map((option, idx) => {
										const payments = getAlternativePayments(option);
										return (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												key={idx}
												className="mb-6 last:mb-0 bg-white border border-purple-200 rounded-[12px] p-6"
											>
												<div className="flex items-center gap-3 mb-4">
													<span className="font-semibold text-purple-700 text-lg">
														{option.name}
													</span>
													<Badge className="bg-purple-100 text-purple-700 px-3 py-1">
														{translation?.liabilityOnly ||
															option.coverage_options}
													</Badge>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
													<span className="flex items-center gap-2 text-green-600 font-medium">
														<span className="text-purple-400">✔️</span>
														{translation?.deductible}: {option.deductible}
													</span>
													<span className="flex items-center gap-2 text-slate-700">
														<span className="text-purple-400">✔️</span>
														{translation?.bodilyInjury}: {option.bodily_injury}
													</span>
													<span className="flex items-center gap-2 text-slate-700">
														<span className="text-purple-400">✔️</span>
														{translation?.propertyDamage}:{" "}
														{option.property_damage}
													</span>
													<span className="flex items-center gap-2 text-slate-700">
														<span className="text-purple-400">✔️</span>
														{translation?.medicalPayments}:{" "}
														{option.medical_payments}
													</span>
												</div>
												<div className="flex flex-wrap gap-2 mb-6">
													{option.rental_car_coverage && (
														<Badge className="bg-purple-100 text-purple-700 px-3 py-1">
															{translation?.rentalCar}
														</Badge>
													)}
													{option.gap_insurance && (
														<Badge className="bg-purple-100 text-purple-700 px-3 py-1">
															{translation?.gapInsurance}
														</Badge>
													)}
													{option.extra_coverage && (
														<Badge className="bg-purple-100 text-purple-700 px-3 py-1">
															{translation?.extraCoverage}
														</Badge>
													)}
												</div>
												{/* Valores da alternativa */}
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="bg-white border border-purple-200 rounded-[12px] p-4 flex flex-col items-center">
														<span className="text-sm text-purple-700 font-medium mb-2">
															{translation?.firstPayment}
														</span>
														<span className="text-2xl font-bold text-purple-700">
															R$ {payments.totalFirst.toFixed(2)}
														</span>
													</div>
													<div className="bg-white border border-purple-200 rounded-[12px] p-4 flex flex-col items-center">
														<span className="text-sm text-purple-700 font-medium mb-2">
															{translation?.monthlyPayment}
														</span>
														<span className="text-2xl font-bold text-purple-700">
															R$ {payments.totalMonthly.toFixed(2)}
														</span>
													</div>
													{payments.totalFull !== null && (
														<div className="bg-white border border-purple-200 rounded-[12px] p-4 flex flex-col items-center">
															<span className="text-sm text-purple-700 font-medium mb-2">
																{translation?.fullPayment}
															</span>
															<span className="text-2xl font-bold text-purple-700">
																R$ {payments.totalFull.toFixed(2)}
															</span>
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
				</div>
				<div className="mt-12 flex justify-center">
					<div className="flex items-center gap-3 bg-yellow-50 border border-yellow-300 rounded-[12px] px-6 py-4 text-yellow-900 text-base font-semibold">
						<span className="text-yellow-500 text-2xl">⚠️</span>
						<span>
							{translation?.warningMessage ||
								"Valid only for drivers listed on the policy; does not cover accidents for unlisted drivers."}
						</span>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4 justify-center items-center">
				<DownloadImageButton
					elementId="quote-summary-export"
					fileName={`cotacao-${data.quote_number || "cotacao"}.png`}
				/>
				<SaveQuoteButton data={data} quoteNumber={data.quote_number} />
			</div>
		</div>
	);
}
