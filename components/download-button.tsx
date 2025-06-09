"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
	quoteNumber?: string;
	elementId: string;
}

export default function DownloadButton({
	quoteNumber,
	elementId,
}: DownloadButtonProps) {
	const [isDownloading, setIsDownloading] = useState(false);

	const downloadAsImage = async () => {
		setIsDownloading(true);

		try {
			// Importação dinâmica do dom-to-image (funciona melhor que html2canvas)
			const domtoimage = (await import("dom-to-image")).default;

			const element = document.getElementById(elementId);
			if (!element) {
				throw new Error("Elemento não encontrado");
			}

			// Configurações para melhor qualidade
			const scale = 2;
			const style = {
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				// biome-ignore lint/style/useTemplate: <explanation>
				width: element.offsetWidth + "px",
				// biome-ignore lint/style/useTemplate: <explanation>
				height: element.offsetHeight + "px",
			};

			const param = {
				height: element.offsetHeight * scale,
				width: element.offsetWidth * scale,
				quality: 1,
				style,
			};

			// Gerar a imagem
			const dataUrl = await domtoimage.toPng(element, param);

			// Criar e fazer download
			const link = document.createElement("a");
			link.download = `insurance-quote-${quoteNumber || Date.now()}.png`;
			link.href = dataUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Erro ao gerar imagem:", error);

			// Fallback para html2canvas com configurações especiais
			try {
				const html2canvas = (await import("html2canvas")).default;
				const element = document.getElementById(elementId);

				if (!element) return;

				const canvas = await html2canvas(element, {
					scale: 2,
					useCORS: true,
					allowTaint: false,
					backgroundColor: "#ffffff",
					ignoreElements: (element) => {
						// Ignorar elementos que podem causar problemas
						return element.classList?.contains("ignore-screenshot") || false;
					},
					onclone: (clonedDoc) => {
						// Substituir cores problemáticas no clone
						const clonedElement = clonedDoc.getElementById(elementId);
						if (clonedElement) {
							// Remover gradientes que causam problema
							const gradientElements = clonedElement.querySelectorAll(
								'[class*="gradient"]',
							);
							// biome-ignore lint/complexity/noForEach: <explanation>
						}
					},
				});

				const link = document.createElement("a");
				link.download = `insurance-quote-${quoteNumber || Date.now()}.png`;
				link.href = canvas.toDataURL("image/png", 1.0);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} catch (fallbackError) {
				console.error("Erro no fallback:", fallbackError);
				alert(
					"Erro ao gerar imagem. Tente novamente ou use um navegador diferente.",
				);
			}
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<Button
			onClick={downloadAsImage}
			disabled={isDownloading}
			className="flex items-center text-white w-full rounded-[8px] gap-2 bg-slate-700 hover:bg-slate-800 mt-4"
		>
			{isDownloading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Download className="h-4 w-4" />
			)}
			{isDownloading ? "Gerando..." : "Download PNG"}
		</Button>
	);
}
