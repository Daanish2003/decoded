import { z } from "zod";

export const ForgotPasswordSchema = z.object({
    email: z
    .string({message: "Email is required"})
    .email({message: "Invalid email address"})
    .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
    )
    .min(5, {message: "Email must be at least 5 characters long"})
    .max(255, {message: "Email must be at most 255 characters long"}),
})