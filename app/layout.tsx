"use client";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { LanguageProvider } from "./language-context";

const inter = Inter({
	subsets: ["latin"],
	weight: ["500", "600", "700", "800"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<LanguageProvider>{children}</LanguageProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
