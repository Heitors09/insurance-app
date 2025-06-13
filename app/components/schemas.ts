import { carriers } from "@/lib/constants";
import { z } from "zod";

const alternativeOptionSchema = z.object({
	name: z.string().min(1),
	coverage_options: z.literal("Liability Only"),
	deductible: z.enum(["$500", "$1000"]),
	bodily_injury: z.enum([
		"$35,000 / $80,000",
		"$50,000 / $100,000",
		"$100,000 / $300,000",
	]),
	medical_payments: z.enum(["$5,000", "$10,000", "$15,000", "$25,000"]),
	property_damage: z.enum(["$50,000", "$100,000", "$150,000", "$250,000"]),
	rental_car_coverage: z.boolean(),
	gap_insurance: z.boolean(),
	extra_coverage: z.boolean(),
	renters_first_payment: z.string().min(1).optional().or(z.literal("")),
	renters_monthly_payment: z.string().min(1).optional().or(z.literal("")),
	fee: z.string().min(1).optional().or(z.literal("")),
	payment_amount_first_payment: z.string().min(1),
	payment_amount_monthly_payment: z.string().min(1),
	full_payment: z.string().optional(),
});

const vehicleSchema = z.object({
	name: z.string().min(1).optional(),
	coverage_options: z.enum(["Liability Only", "Full Coverage"]),
	deductible: z.enum(["$500", "$1000"]),
	bodily_injury: z.enum([
		"$35,000 / $80,000",
		"$50,000 / $100,000",
		"$100,000 / $300,000",
	]),
	medical_payments: z.enum(["$5,000", "$10,000", "$15,000", "$25,000"]),
	property_damage: z.enum(["$50,000", "$100,000", "$150,000", "$250,000"]),
	rental_car_coverage: z.boolean(),
	gap_insurance: z.boolean(),
	extra_coverage: z.boolean(),
});

export const formSchema = z.object({
	type_of_insurance: z.enum(["Auto", "Commercial Auto"]),
	agent_name: z.string().min(1),
	csr: z.string().min(1),
	client_name: z.string().min(1),
	insurance_carrier: z.enum(carriers),
	policy_term: z.enum(["6 months", "12 months"]),
	quote_number: z.string().optional(),
	renters_first_payment: z.string().min(1).optional().or(z.literal("")),
	renters_monthly_payment: z.string().min(1).optional().or(z.literal("")),
	fee: z.string().min(1).optional().or(z.literal("")),
	vehicles: z.array(vehicleSchema),
	alternativeOption: z.array(alternativeOptionSchema).optional(),
	payment_amount_first_payment: z.string().min(1),
	payment_amount_monthly_payment: z.string().min(1),
	full_payment: z.string().optional(),
});

export type VehicleSchema = z.infer<typeof vehicleSchema>;
export type AlternativeOptionSchema = z.infer<typeof alternativeOptionSchema>;
export type FormSchema = z.infer<typeof formSchema>;
