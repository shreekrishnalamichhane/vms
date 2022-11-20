import { z } from "zod";

const AuthValidation = {
    RegisterInputValidation: z.object({
        email: z.string().email(),
        password: z.string().min(8).max(15),
        name: z.string().min(1),
        phone: z.string()
    }),
    LogininputValidation: z.object({
        email: z.string().email(),
        password: z.string()
    }),
    UpdateProfileInputValidation: z.object({
        name: z.string(),
        phone: z.string()
    })
}
export default AuthValidation