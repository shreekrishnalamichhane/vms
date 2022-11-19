import { z } from "zod";

const VaccineValidation = {
    VaccineStoreInputValidation: z.object({
        name: z.string(),
        description: z.string(),
        image: z.string(),
        numberOfDoses: z.optional(z.number()),
        manufacturer: z.optional(z.string()),
        developedYear: z.optional(z.number()),
        ageGroup: z.optional(z.string()),
        sideEffects: z.optional(z.string()),
    }),
    VaccineUpdateInputValidation: z.object({
        name: z.string(),
        description: z.string(),
        image: z.optional(z.string()),
        numberOfDoses: z.optional(z.number()),
        manufacturer: z.optional(z.string()),
        developedYear: z.optional(z.number()),
        ageGroup: z.optional(z.string()),
        sideEffects: z.optional(z.string()),
    }),
}
export default VaccineValidation