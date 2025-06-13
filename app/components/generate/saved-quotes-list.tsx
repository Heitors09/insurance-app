"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SavedQuote {
	id: string;
	data: {
		client_name: string;
		insurance_carrier: string;
		type_of_insurance: string;
		quote_number?: string;
		payment_amount_first_payment?: string;
		[key: string]: unknown;
	};
	savedAt?: string;
	clientName?: string;
	carrier?: string;
	totalAmount?: number;
}

export default function SavedQuotesList() {
	const [quotes, setQuotes] = useState<SavedQuote[]>([]);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		setError(null);
		const saved = localStorage.getItem("savedQuotes");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
					const arr = Object.values(parsed) as SavedQuote[];
					setQuotes(arr);
				} else if (Array.isArray(parsed)) {
					setQuotes(parsed as SavedQuote[]);
				} else {
					setQuotes([]);
					setError("Formato inválido: não é um objeto nem array.");
				}
			} catch (e) {
				setQuotes([]);
				setError(
					"Erro ao ler as cotações salvas. Verifique o formato do localStorage.",
				);
			}
		} else {
			setQuotes([]);
		}
	}, []);

	function handleDelete(id: string) {
		// Remove do objeto salvo
		const saved = localStorage.getItem("savedQuotes");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (parsed && typeof parsed === "object") {
					delete parsed[id];
					localStorage.setItem("savedQuotes", JSON.stringify(parsed));
					setQuotes(Object.values(parsed));
				}
			} catch {
				// erro silencioso
			}
		}
	}

	if (error) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-12">
				<span className="text-red-500 text-lg mb-2">{error}</span>
			</div>
		);
	}

	if (!quotes.length) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-12">
				<FileText className="w-12 h-12 text-slate-300 mb-4" />
				<span className="text-slate-500 text-lg">Nenhuma cotação salva.</span>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col items-center">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 w-full max-w-5xl mx-auto">
				{quotes.map((q) => (
					<div
						key={q.id}
						className="relative bg-white border-l-4 border-blue-500 border-slate-200 rounded-[18px] shadow-md p-7 flex flex-col gap-4 hover:shadow-xl transition-all duration-200 group cursor-pointer hover:ring-2 hover:ring-blue-200"
						onClick={() => router.push(`/quote/${q.id}`)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								router.push(`/quote/${q.id}`);
							}
						}}
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						role="button"
						tabIndex={0}
					>
						<div className="flex items-center gap-2 mb-1">
							<Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
								{q.data.type_of_insurance}
							</Badge>
							<span className="text-xs text-slate-400 ml-auto">
								{q.savedAt ? new Date(q.savedAt).toLocaleDateString() : ""}
							</span>
						</div>
						<div className="flex items-center gap-2 mb-2">
							<FileText className="w-6 h-6 text-blue-400" />
							<span className="font-bold text-lg text-blue-700 tracking-tight">
								Cotação #{q.data.quote_number || q.id}
							</span>
						</div>
						<div className="flex flex-col gap-1 mb-2">
							<div className="flex items-center gap-2 text-slate-700 text-base">
								<span className="font-semibold">Cliente:</span>
								<span className="text-slate-900">{q.data.client_name}</span>
							</div>
							<div className="flex items-center gap-2 text-slate-500 text-sm">
								<span className="font-semibold">Seguradora:</span>
								<span>{q.data.insurance_carrier}</span>
							</div>
						</div>
						<div className="border-t border-slate-100 my-2" />
						<div className="flex items-center gap-2 mt-auto">
							<Badge className="bg-blue-600 text-white text-base px-3 py-1 font-bold shadow">
								{q.data.payment_amount_first_payment
									? `R$ ${Number(q.data.payment_amount_first_payment).toFixed(2)}`
									: "--"}
							</Badge>
							<span className="text-xs text-slate-400 ml-2">
								Primeira parcela
							</span>
							<div className="flex gap-1 ml-auto">
								<Button
									size="icon"
									variant="secondary"
									className="rounded-full"
									title="Visualizar"
									onClick={(e) => {
										e.stopPropagation();
										router.push(`/quote/${q.id}`);
									}}
								>
									<Eye className="w-4 h-4" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(q.id);
									}}
									title="Excluir"
								>
									<Trash2 className="w-4 h-4 text-red-500" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
