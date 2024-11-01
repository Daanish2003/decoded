import { sendPasswordResetEmail } from "@/lib/email"
import { generatePasswordResetToken } from "@/lib/token"
import { getUserByEmail } from "@/utils/getUser"
import { ForgotPasswordSchema } from "@/zod/auth/forgotPasswordSchema"
import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
    try{
        const body = request.json()

        const validatedFields = ForgotPasswordSchema.safeParse(body)

        if(!validatedFields.success) {
            return NextResponse.json({message: "Invalid Fields"}, {status: 400})
        }

        const {email} = validatedFields.data

        const existingUser = await getUserByEmail(email)

        if(!existingUser) {
            return NextResponse.json({
               message: "User does not exist"
            }, {
                status: 400
            })
        }

        const passwordResetToken = await generatePasswordResetToken(email);


        await sendPasswordResetEmail({
           email: passwordResetToken.email,
           token: passwordResetToken.token
    })

        return NextResponse.json({message: "Email sent"}, {status: 200})

    } catch(error: any) {
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}