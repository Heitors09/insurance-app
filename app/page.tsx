"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { languages } from "@/lib/languages";
import type { Languages } from "@/lib/types";
import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import GenerateQuote from "./components/generate-quote";

export default function Home() {
	const [selectedLanguage, setSelectedLanguage] =
		useState<Languages>("English");

	const translation = languages[selectedLanguage];

	const languageDisplayNames: { [key in Languages]: string } = {
		English: "English",
		Português: "Português",
		Español: "Español",
		Kreyòl_Ayisyen: "Kreyòl Ayisyen",
	};

	return (
		<main className="py-20 flex flex-col items-center space-y-12 bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">
			<h1 className="text-5xl tracking-tight font-semibold text-center text-slate-700">
				{translation.mainTitle}
			</h1>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{
						<Button className="bg-gradient-to-br from-slate-700 to-slate-500 ring-1 hover:brightness-95 ring-slate-200 shadow-sm flex items-center gap-2 px-3 py-2 rounded-[8px] text-white text-sm">
							<Globe className="size-4" />{" "}
							{languageDisplayNames[selectedLanguage] || "Selecione o idioma"}{" "}
							<ChevronDown className="size-4 -ml-1" />
						</Button>
					}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-[200px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
					<DropdownMenuItem
						onClick={() => setSelectedLanguage("English")}
						className="hover:text-slate-900 text-slate-500"
					>
						English
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-slate-300 mx-2" />
					<DropdownMenuItem
						onClick={() => setSelectedLanguage("Português")}
						className="hover:text-slate-900 text-slate-500"
					>
						Português
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-slate-300 mx-2" />
					<DropdownMenuItem
						onClick={() => setSelectedLanguage("Español")}
						className="hover:text-slate-900 text-slate-500"
					>
						Español
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-slate-300 mx-2" />
					<DropdownMenuItem
						onClick={() => setSelectedLanguage("Kreyòl_Ayisyen")}
						className="hover:text-slate-900 text-slate-500"
					>
						Kreyòl Ayisyen
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Tabs defaultValue="generator" className="">
				<TabsList className="h-full w-[800px]">
					<TabsTrigger className="rounded-[8px]" value="generator">
						{translation.generateQuoteBtn}
					</TabsTrigger>
					<TabsTrigger className="rounded-[8px]" value="saved">
						{translation.savedQuotesTitle}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="generator">
					<GenerateQuote selectedLanguage={selectedLanguage} />
				</TabsContent>

				<TabsContent value="saved">
					{/* Conteúdo da aba "Cotações Salvas" */}
				</TabsContent>
			</Tabs>
		</main>
	);
}
