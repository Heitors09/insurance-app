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
] as const;

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

export const bodilyInjuryConstant = [
	"$35,000 / $80,000",
	"$50,000 / $100,000",
	"$100,000 / $300,000",
];

export const medicalPaymentsConstant = [
	"$5,000",
	"$10,000",
	"$15,000",
	"$25,000",
];

export const propertyDamageConstant = [
	"$50,000",
	"$100,000",
	"$150,000",
	"$250,000",
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
