"use client";

import { languages } from "@/lib/languages";
import type { Languages } from "@/lib/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, createContext, useState } from "react";

interface LanguageContextType {
	currentLanguage: Languages;
	setLanguage: (language: Languages) => void;
	translations: (typeof languages)[Languages];
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

const queryClient = new QueryClient();

export const AppWrapper = ({ children }: { children: ReactNode }) => {
	const [currentLanguage, setCurrentLanguage] = useState<Languages>("English");

	const translations = languages[currentLanguage as Languages];

	const setLanguage = (language: Languages) => {
		setCurrentLanguage(language);
	};

	const value: LanguageContextType = {
		currentLanguage,
		setLanguage,
		translations,
	};

	return (
		<LanguageContext.Provider value={value}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</LanguageContext.Provider>
	);
};
