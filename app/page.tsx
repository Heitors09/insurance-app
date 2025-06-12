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
import { ChevronDown, Globe } from "lucide-react";
import { useContext } from "react";
import GenerateQuote from "./components/generate/generate-quote";
import { LanguageContext } from "./language-context";

export default function Home() {
	const translation = useContext(LanguageContext);

	return (
		<main className="py-20 flex flex-col items-center space-y-12 bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">
			<h1 className="text-5xl tracking-tight font-semibold text-center text-slate-700">
				{translation?.translations.mainTitle}
			</h1>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{
						<Button className="bg-gradient-to-br from-slate-700 to-slate-500 ring-1 hover:brightness-95 ring-slate-200 shadow-sm flex items-center gap-2 px-3 py-2 rounded-[8px] text-white text-sm">
							<Globe className="size-4" />{" "}
							{translation?.currentLanguage || "Selecione o idioma"}{" "}
							<ChevronDown className="size-4 -ml-1" />
						</Button>
					}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-[200px] mt-1 ring-1 ring-slate-200 bg-slate-100 border-none rounded-[8px]">
					<DropdownMenuItem
						onClick={() => translation?.setLanguage("English")}
						className="hover:text-slate-900 text-slate-500"
					>
						English
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-slate-300 mx-2" />
					<DropdownMenuItem
						onClick={() => translation?.setLanguage("Português")}
						className="hover:text-slate-900 text-slate-500"
					>
						Português
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-slate-300 mx-2" />
					<DropdownMenuItem
						onClick={() => translation?.setLanguage("Español")}
						className="hover:text-slate-900 text-slate-500"
					>
						Español
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-slate-300 mx-2" />
					<DropdownMenuItem
						onClick={() => translation?.setLanguage("Kreyòl_Ayisyen")}
						className="hover:text-slate-900 text-slate-500"
					>
						Kreyòl Ayisyen
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Tabs defaultValue="generator" className="flex items-center">
				<TabsList className="h-full w-[800px]">
					<TabsTrigger className="rounded-[8px]" value="generator">
						{translation?.translations.generateQuoteBtn}
					</TabsTrigger>
					<TabsTrigger className="rounded-[8px]" value="saved">
						{translation?.translations.savedQuotesTitle}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="generator">
					<GenerateQuote />
				</TabsContent>

				<TabsContent value="saved">exemplo</TabsContent>
			</Tabs>
		</main>
	);
}
