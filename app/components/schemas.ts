// src/lib/schemas/quoteSchema.ts
import { z } from "zod";

const feeSchema = z
	.object({
		optedIn: z.boolean().optional(),
		value: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.optedIn) {
			if (!data.value || data.value.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "The fee amount is required when applicable.",
					path: ["value"],
				});
			}
		}
	});

const rentersInsuranceSchema = z
	.object({
		optedIn: z.boolean().optional(),
		firstPayment: z
			.number()
			.transform((val) => (Number.isNaN(val) ? undefined : val))
			.optional(),
		monthlyPayment: z
			.number()
			.transform((val) => (Number.isNaN(val) ? undefined : val))
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (data.optedIn) {
			if (data.firstPayment === undefined) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "First payment is required when opted in",
					path: ["firstPayment"],
				});
			}
			if (data.monthlyPayment === undefined) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Monthly payment is required when opted in",
					path: ["monthlyPayment"],
				});
			}
		}
	});
// ✅ Deductible schema
const deductibleSchema = z
	.object({
		optedIn: z.boolean().optional(),
		value: z.number().optional(),
	})
	.superRefine((data, ctx) => {
		if (
			data.optedIn === true &&
			(data.value === undefined || data.value === null || data.value === 0)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Deductible amount is required when opted in",
				path: ["value"],
			});
		}
	});

const bodilyInjurySchema = z
	.object({
		optedIn: z.boolean().optional(),
		value: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.optedIn === true && (!data.value || data.value.trim() === "")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Bodily injury coverage is required when opted in",
				path: ["value"],
			});
		}
	});

const medicalPaymentsSchema = z
	.object({
		optedIn: z.boolean().optional(),
		value: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.optedIn === true && (!data.value || data.value.trim() === "")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Medical payments coverage is required when opted in",
				path: ["value"],
			});
		}
	});

const propertyDamageSchema = z
	.object({
		optedIn: z.boolean().optional(),
		value: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.optedIn === true && (!data.value || data.value.trim() === "")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Property damage coverage is required when opted in",
				path: ["value"],
			});
		}
	});

export const vehicleSchema = z
	.object({
		name: z.string().min(1, "Vehicle name is required"),
		coverageOpt: z.enum(["Full Coverage", "Liability Only"]).nullable(),

		deductible: deductibleSchema,
		bodilyInjury: bodilyInjurySchema,
		medicalPayments: medicalPaymentsSchema,
		propertyDamage: propertyDamageSchema,

		rentalCarCoverage: z.boolean(),
		extraCoverage: z.boolean().optional(),
		gapInsurance: z.boolean(),
	})
	.refine(
		(data) => {
			return (
				data.deductible.optedIn ||
				data.bodilyInjury.optedIn ||
				data.medicalPayments.optedIn ||
				data.propertyDamage.optedIn ||
				data.rentalCarCoverage ||
				data.gapInsurance
			);
		},
		{
			message: "At least one coverage option must be selected",
			path: ["coverageOpt"],
		},
	);

const paymentAmounts = z.object({
	firstPayment: z.number().int(),
	monthlyPayment: z.number().int(),
});

const fullPayment = z
	.object({
		optedIn: z.boolean().optional(),
		paymentAmount: z.number().int().optional(),
	})
	.refine(
		(data) => {
			// Se optedIn for true, paymentAmount deve ser obrigatório
			if (data.optedIn) {
				return data.paymentAmount !== undefined;
			}
			return true;
		},
		{
			message: "paymentAmount é obrigatório quando optedIn é true",
			path: ["paymentAmount"],
		},
	);

// Schema principal
const paymentSchema = z.object({
	paymentAmounts,
	fullPayment,
});

// Main Form Schema
export const quoteFormSchema = z.object({
	InsuranceType: z
		.string({
			required_error: "Insurance type is required",
		})
		.min(1, "Insurance type is required"),

	agent: z
		.string({
			required_error: "Agent is required",
		})
		.min(1, "Agent is required"),

	csr: z
		.string({
			required_error: "CSR is required",
		})
		.min(1, "CSR is required"),

	carrier: z
		.string({
			required_error: "Carrier is required",
		})
		.min(1, "Carrier is required"),
	clientName: z.string().min(1, "Client name is required"),
	months: z.enum(["6", "12"], {
		required_error: "You must select a policy term",
	}),
	quoteNumber: z.string().optional(),
	vehicles: z.array(vehicleSchema).min(1, "At least one vehicle is required"), // At least one vehicle
	rentersInsurance: rentersInsuranceSchema.optional(),
	fee: feeSchema.optional(),
	paymentAmounts: paymentSchema,
});

export type QuoteFormSchema = z.infer<typeof quoteFormSchema>;
