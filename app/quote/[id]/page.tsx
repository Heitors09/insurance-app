"use client";
import QuoteSummary from "@/app/components/generate/quote-summary";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuoteByIdPage() {
	const { id } = useParams();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [quote, setQuote] = useState<any | null>(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!id) return;
		const saved = localStorage.getItem("savedQuotes");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				// biome-ignore lint/complexity/useOptionalChain: <explanation>
				if (parsed && typeof id === "string" && id in parsed) {
					setQuote(parsed[id as keyof typeof parsed].data);
				} else {
					setNotFound(true);
				}
			} catch {
				setNotFound(true);
			}
		} else {
			setNotFound(true);
		}
	}, [id]);

	if (notFound) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-20 text-red-500 text-lg">
				Cotação não encontrada.
			</div>
		);
	}
	if (!quote) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-20 text-slate-400 text-lg">
				Carregando cotação...
			</div>
		);
	}
	return (
		<Card className="border-none bg-white w-[800px] text-slate-900 ring-1 ring-slate-200 px-8 flex flex-col items-center text-slate-900 rounded-[8px] mx-auto my-12">
			<QuoteSummary data={quote} />
		</Card>
	);
}
