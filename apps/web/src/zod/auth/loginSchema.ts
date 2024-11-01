import { z } from "zod";

export const LoginSchema = z.object({
    email: z
    .string({message: "Email is required"})
    .email({message: "Invalid email address"})
    .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
    )
    .min(5, {message: "Email must be at least 5 characters long"})
    .max(255, {message: "Email must be at most 255 characters long"}),
    password: z
    .string({message: "password is required"})
    .min(8, {message: "Password must be at least 8 characters long"})
    .max(100, {message: "Password must be at most 100 characters long"})
    .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
    .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
    .regex(/[0-9]/, {message: "Password must contain at least one digit"})
    .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character"})
    .refine((password) => !/^(.)\1{2,}$/.test(password), {
        message: "Password must not contain 3 or more repeating characters"
    })
    .refine((password) => !/^[a-zA-Z]+$/.test(password), {
        message: "Password must not be purely alphabetic"
    })
    .refine((password) => !/^(\d+)$/.test(password), {
        message: "Password must not be purely numeric"
    }),
    code: z
    .optional(z
        .string()
        .min(6, {message: "The code should atleat have six digit"})
        .max(6, {message: "The code should not exceed 6 digits"})
        .regex(/^\d+$/, { message: "OTP must contain only digits" })
    )
})
