import { createClient } from "@supabase/supabase-js";
import type {
	fetchedAgentNames,
	fetchedBodilyInjuryOptions,
	fetchedCarrierOptions,
	fetchedCsrOptions,
	fetchedMedicalPaymentsOptions,
	fetchedPropertyDamageOptions,
} from "./types";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

//create supabase fuctions
export const fetchAgentNames = async () => {
	const { data, error } = await supabase.from("agent_names").select("*");

	error && console.error(error);

	return data as fetchedAgentNames[];
};

export const fetchCsrOptions = async () => {
	const { data, error } = await supabase.from("csr").select("*");

	error && console.error(error);

	return data as fetchedCsrOptions[];
};

export const fetchCarrierOptions = async () => {
	const { data, error } = await supabase.from("carriers").select("*");

	error && console.error(error);

	return data as fetchedCarrierOptions[];
};

export const fetchBodilyInjuryOptions = async () => {
	const { data, error } = await supabase.from("bodily_options").select("*");

	error && console.error(error);

	return data as fetchedBodilyInjuryOptions[];
};

export const fetchMedicalPaymentsOptions = async () => {
	const { data, error } = await supabase.from("medical_options").select("*");

	error && console.error(error);

	return data as fetchedMedicalPaymentsOptions[];
};

export const fetchPropertyDamageOptions = async () => {
	const { data, error } = await supabase.from("property_options").select("*");

	error && console.error(error);

	return data as fetchedPropertyDamageOptions[];
};
