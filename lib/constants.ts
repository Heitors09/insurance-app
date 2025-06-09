export const carriers = [
	"Progressive",
	"Bristol West",
	"National General",
	"Embark",
	"Travelers",
	"Geico",
	"Safeco",
	"Hannover",
	"The Hartford",
	"Pilgrim",
];

export const csrNames = [
	"Lukas Fraga",
	"Gabriel Oliviera",
	"Ricardo Mendonca",
	"Pablo Lima",
	"Christian Benevides",
	"Matheus Ferreira",
	"Marc Etienne",
	"Dalynx",
	"Guilherme Souza",
	"Alexandre Dias",
];

export const defaultAlternativeOption = [
	{
		name: "",
		coverageOpt: "Liability Only" as const,

		deductible: {
			optedIn: false,
			value: undefined,
		},
		bodilyInjury: {
			optedIn: false,
			value: "",
		},
		medicalPayments: {
			optedIn: false,
			value: "",
		},
		propertyDamage: {
			optedIn: false,
			value: "",
		},

		rentalCarCoverage: false,
		gapInsurance: false,
		extraCoverage: false,
	},
];
