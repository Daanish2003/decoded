import { SignupSchema } from "@/zod/auth/signupSchema";
import { NextResponse } from "next/server";
import prisma from "@repo/db/client"
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid"
import { sendVerificationEmail } from "@/lib/email";
import { getUserByEmail } from "@/utils/getUser";
import { createUser } from "@/lib/user";
import { generateVerificationToken } from "@/lib/token";

export const POST = async(request: Request) => {
    try {
        const body = await request.json()
        const validatedFields = SignupSchema.safeParse(body);

    if(!validatedFields.success) {
        return NextResponse.json({message: validatedFields.error}, {status: 400})
    }

    const { fullname, password, confirmPassword, email} = validatedFields.data

    if(confirmPassword !== password) {
        return NextResponse.json({message: "password does not match"}, {status: 400})
    }

    const existingUser = await getUserByEmail(email)

    if(existingUser) {
        return NextResponse.json({message: "User already exits"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)


    const newUser = await createUser(email, hashedPassword, fullname)

    if (!newUser) {
        return {
            error: "Failed to create user"
        }
     }

    const verificationToken = await generateVerificationToken(newUser.email)

    
    await sendVerificationEmail({token: verificationToken.token, email: verificationToken.email});


    return NextResponse.json({message: "Verification email has been sent"}, {status: 200})
    } catch (error){
        return NextResponse.json({message: "Something went wrong"}, {status: 401})
    }


}

