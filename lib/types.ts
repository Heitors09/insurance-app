export type Languages = "English" | "Português" | "Español" | "Kreyòl_Ayisyen";

export type fetchedAgentNames = {
	id: string;
	created_at: string;
	name: string;
};

export type fetchedCsrOptions = {
	id: string;
	created_at: string;
	csr_names: string;
};

export type fetchedCarrierOptions = {
	id: string;
	created_at: string;
	carrier_name: string;
};

export type fetchedBodilyInjuryOptions = {
	id: string;
	created_at: string;
	bodily_coverage: string;
};

export type fetchedMedicalPaymentsOptions = {
	id: string;
	created_at: string;
	medical_coverage: string;
};

export type fetchedPropertyDamageOptions = {
	id: string;
	created_at: string;
	property_coverage: string;
};
