import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export async function getVerificationTokenByEmail(email: string) {
    try {
       const verificationToken = await prisma.verificationToken.findFirst({
           where: { email },
           select: { id : true }
       });

       return verificationToken
    } catch (error) {
        return null
    }
 }

 export async function getVerificationTokenByToken(token: string) {
    try {
       const verificationToken = await prisma.verificationToken.findFirst({
           where: { token },
           select: { id : true, email: true, expires: true, }
       });

       return verificationToken;
    } catch (error) {
        return null
    }
 }

 export async function getTwoFactorTokenByEmail(email: string) {
    try{
       const twoFactorToken = await prisma.twoFactorToken.findFirst({
         where: {
            email
         },
         select: {
            id: true,
            token: true,
            expires: true
         }
       })
       return twoFactorToken
    } catch (error) {
      return null
    }
 }

 export async function getPasswordResetTokenByEmail(email: string) {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email },
            select: { id: true }
        });
        return passwordResetToken;
    } catch (error) {
        return null
    }
 }

 export async function getPasswordResetTokenByToken(token: string) {
   try {
       const passwordResetToken = await prisma.passwordResetToken.findFirst({
           where: { token },
           select: { id: true, email: true, expires: true }
       });
       return passwordResetToken;
   } catch (error) {
     return null
   }
}