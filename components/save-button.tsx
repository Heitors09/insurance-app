import type { QuoteFormSchema } from "@/app/components/schemas";
import { AlertCircle, Check, Save } from "lucide-react";
import { useState } from "react";

const SaveQuoteButton = ({
	data,
	quoteNumber,
}: { data: QuoteFormSchema; quoteNumber: string | undefined }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(
		null,
	); // 'success', 'error', null
	const [customName, setCustomName] = useState("");
	const [showNameInput, setShowNameInput] = useState(false);

	// Função para gerar um ID único se não houver quoteNumber
	const generateUniqueId = () => {
		return `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	};

	// Função para salvar os dados
	const saveQuoteData = () => {
		setIsSaving(true);

		try {
			// Pega os dados existentes do localStorage
			const existingQuotes = JSON.parse(
				localStorage.getItem("savedQuotes") || "{}",
			);

			// Cria um identificador único para esta cotação
			const quoteId = quoteNumber || customName || generateUniqueId();

			// Objeto com os dados da cotação e metadados
			const quoteToSave = {
				id: quoteId,
				data: data,
				savedAt: new Date().toISOString(),
				clientName: data.clientName || "Cliente não informado",
				carrier: data.carrier || "Seguradora não informada",
				totalAmount: calculateTotalAmount(data),
			};

			// Adiciona/atualiza a cotação no objeto de cotações salvas
			existingQuotes[quoteId] = quoteToSave;

			// Salva no localStorage
			localStorage.setItem("savedQuotes", JSON.stringify(existingQuotes));

			// Feedback de sucesso
			setSaveStatus("success");
			setShowNameInput(false);
			setCustomName("");

			// Reset do status após 3 segundos
			setTimeout(() => {
				setSaveStatus(null);
			}, 3000);
		} catch (error) {
			console.error("Erro ao salvar cotação:", error);
			setSaveStatus("error");

			// Reset do status após 3 segundos
			setTimeout(() => {
				setSaveStatus(null);
			}, 3000);
		}

		setIsSaving(false);
	};

	// Função auxiliar para calcular o valor total
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const calculateTotalAmount = (data: any) => {
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
			data.fee?.optedIn && data.fee?.value
				? Number.parseInt(data.fee.value)
				: 0;

		const totalFirstPayment = baseFirstPayment + rentersFirst + feeAmount;
		const totalMonthlyPayment = baseMonthlyPayment + rentersMonthly;
		const annualPremium =
			totalFirstPayment +
			totalMonthlyPayment * (Number.parseInt(data.months || 1) - 1);

		return annualPremium;
	};

	// Função para mostrar/esconder input de nome personalizado
	const toggleNameInput = () => {
		if (!quoteNumber) {
			setShowNameInput(!showNameInput);
		} else {
			saveQuoteData();
		}
	};

	// Função para listar cotações salvas (para demonstração)
	const listSavedQuotes = () => {
		try {
			const savedQuotes = JSON.parse(
				localStorage.getItem("savedQuotes") || "{}",
			);
			console.log("Cotações salvas:", savedQuotes);
			alert(
				`Você tem ${Object.keys(savedQuotes).length} cotações salvas. Verifique o console para detalhes.`,
			);
		} catch (error) {
			console.error("Erro ao listar cotações:", error);
		}
	};

	return (
		<div className="flex flex-col gap-3 w-full  mx-auto ">
			{/* Input para nome personalizado (se não houver quoteNumber) */}
			{showNameInput && !quoteNumber && (
				<div className="flex  gap-2">
					<input
						type="text"
						placeholder="Nome para identificar esta cotação"
						value={customName}
						onChange={(e) => setCustomName(e.target.value)}
						className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<button
						type="button"
						onClick={saveQuoteData}
						disabled={!customName.trim() || isSaving}
						className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
					>
						{isSaving ? "Salvando..." : "Salvar"}
					</button>
				</div>
			)}

			{/* Botão principal de salvar */}
			<button
				type="button"
				onClick={toggleNameInput}
				disabled={isSaving}
				className={`
          flex items-center justify-center gap-2 px-2 py-2 hover:cursor-pointer bg-slate-100 ring-1 ring-slate-700  rounded-[8px] font-medium  
          ${
						saveStatus === "success"
							? "bg-green-600 text-slate-700"
							: saveStatus === "error"
								? "bg-red-600 text-slate-700"
								: "bg-blue-600 text-slate-700 hover:bg-slate-200"
					}
          ${isSaving ? "opacity-75 cursor-not-allowed" : ""}
        `}
			>
				{saveStatus === "success" ? (
					<>
						<Check className="h-5 w-5" />
						Cotação Salva!
					</>
				) : saveStatus === "error" ? (
					<>
						<AlertCircle className="h-5 w-5" />
						Erro ao Salvar
					</>
				) : (
					<>
						<Save className="h-5 w-5" />
						{isSaving ? "Salvando..." : "Salvar Cotação"}
					</>
				)}
			</button>
		</div>
	);
};

export default SaveQuoteButton;
