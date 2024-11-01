import { ResetPasswordSchema } from "@/zod/auth/resetPasswordSchema"
import prisma from "@repo/db/client";
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { getPasswordResetTokenByToken } from "@/utils/getTokens";
import { getUserByEmail } from "@/utils/getUser";

export const POST = async(request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get("token");

        if(!token) {
            return NextResponse.json({message: "Invalid token"}, {status: 400})
        }

        const body = request.body

        const validatedFields = ResetPasswordSchema.safeParse(body)

        if(!validatedFields.success) {
            return NextResponse.json({message: "Invalid Fields"}, {status: 400})
        }

        const {password, confirmPassword} = validatedFields.data

        if (password !==confirmPassword) {
            return NextResponse.json({message: "Password does not match"}, {status: 400})
        }

        const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return NextResponse.json({
            message: "Invalid existing token"
        }, {status: 400})
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return  NextResponse.json({
            message: "Token has expired"
        }, {
            status: 400
        })
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        return  NextResponse.json({
            error: "Email does not exist!"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    });

    return NextResponse.json({message: "Password has been updated successfully"}, {status: 200})



    } catch (error: any) {
        return NextResponse.json({message: "Internal server Error"}, {status: 500})
    }
    

}