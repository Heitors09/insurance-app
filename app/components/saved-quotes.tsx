"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Building2,
	Calendar,
	CarIcon,
	DollarSign,
	Trash2,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { QuoteFormSchema } from "./schemas";

interface SavedQuote {
	id: string;
	data: QuoteFormSchema;
	savedAt: string;
	clientName: string;
	carrier: string;
	totalAmount: number;
}

export default function SavedQuotes() {
	const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
	const router = useRouter();

	useEffect(() => {
		const loadSavedQuotes = () => {
			try {
				const stored = localStorage.getItem("savedQuotes");
				if (stored) {
					const quotesData = JSON.parse(stored);
					const quotesArray = Object.values(quotesData) as SavedQuote[];
					// Sort by savedAt date, most recent first
					quotesArray.sort(
						(a, b) =>
							new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
					);
					setSavedQuotes(quotesArray);
				}
			} catch (error) {
				console.error("Error loading saved quotes:", error);
			}
		};

		loadSavedQuotes();
	}, []);

	const handleViewQuote = (quoteId: string) => {
		router.push(`/saved-quotes/${quoteId}`);
	};

	const handleDeleteQuote = (quoteId: string, e: React.MouseEvent) => {
		e.stopPropagation();

		if (confirm("Are you sure you want to delete this quote?")) {
			try {
				const stored = localStorage.getItem("savedQuotes");
				if (stored) {
					const quotesData = JSON.parse(stored);
					delete quotesData[quoteId];
					localStorage.setItem("savedQuotes", JSON.stringify(quotesData));

					// Update state
					setSavedQuotes((prev) =>
						prev.filter((quote) => quote.id !== quoteId),
					);
				}
			} catch (error) {
				console.error("Error deleting quote:", error);
			}
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="mt-8">
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<div className="bg-slate-700 p-2 rounded-[8px]">
						<CarIcon className="h-6 w-6 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-slate-800">Saved Quotes</h1>
				</div>
				<p className="text-slate-600">
					{savedQuotes.length} saved quote{savedQuotes.length !== 1 ? "s" : ""}{" "}
					found
				</p>
			</div>

			{savedQuotes.length === 0 ? (
				<Card className="text-center border-none py-12">
					<CardContent>
						<div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
							<CarIcon className="h-8 w-8 text-slate-400" />
						</div>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">
							No saved quotes
						</h3>
						<p className="text-slate-600 mb-4">
							You haven't saved any quotes yet.
						</p>
						<Button onClick={() => router.push("/quote")}>
							Create New Quote
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{savedQuotes.map((quote) => (
						<Card
							key={quote.id}
							className="hover:shadow-lg border-none w-[300px] rounded-[8px] transition-shadow duration-200 cursor-pointer group"
							onClick={() => handleViewQuote(quote.id)}
						>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-start mb-2">
									<CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
										Quote #{quote.id}
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => handleDeleteQuote(quote.id, e)}
										className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
								<div className="flex items-center gap-2 mb-3">
									<Badge
										variant="secondary"
										className="bg-slate-100 text-slate-700"
									>
										{quote.data.InsuranceType}
									</Badge>
									<Badge
										variant="outline"
										className="border-slate-300 rounded-[8px]"
									>
										{quote.data.months} months
									</Badge>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-sm">
										<User className="h-4 w-4 text-slate-500" />
										<span className="font-medium text-slate-700">
											{quote.clientName}
										</span>
									</div>

									<div className="flex items-center gap-2 text-sm">
										<Building2 className="h-4 w-4 text-slate-500" />
										<span className="text-slate-600">{quote.carrier}</span>
									</div>

									<div className="flex items-center gap-2 text-sm">
										<CarIcon className="h-4 w-4 text-slate-500" />
										<span className="text-slate-600">
											{quote.data.vehicles?.length || 0} vehicle
											{(quote.data.vehicles?.length || 0) !== 1 ? "s" : ""}
										</span>
									</div>

									<div className="flex items-center gap-2 text-sm">
										<Calendar className="h-4 w-4 text-slate-500" />
										<span className="text-slate-600">
											{formatDate(quote.savedAt)}
										</span>
									</div>
								</div>

								<div className="pt-3 border-t border-slate-100">
									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-600">Total Amount</span>
										<div className="flex items-center gap-1">
											<DollarSign className="h-4 w-4 text-green-600" />
											<span className="text-lg font-bold text-green-600">
												{quote.totalAmount.toLocaleString("en-US", {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</span>
										</div>
									</div>
								</div>

								<Button
									className="w-full border-none ring-1 ring-slate-700 rounded-[8px] mt-4"
									variant="outline"
									onClick={(e) => {
										e.stopPropagation();
										handleViewQuote(quote.id);
									}}
								>
									View Quote Details
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
