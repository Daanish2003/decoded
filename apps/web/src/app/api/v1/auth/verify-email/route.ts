import { createSession } from "@/lib/session";
import { getVerificationTokenByToken } from "@/utils/getTokens";
import { getUserByEmail } from "@/utils/getUser";
import prisma from "@repo/db/client";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;

    const token = searchParams.get("token");

    if (token === null) {
      return NextResponse.json({ message: "Token not found" });
    }

    const exisitingToken = await getVerificationTokenByToken(token)

    if (!exisitingToken) {
      return NextResponse.json({ message: "Token does not exist" });
    }

    const hasExpired = new Date(exisitingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ message: "Token has Expired" });
    }

    const existingUser = await getUserByEmail(exisitingToken.email)

    if (!existingUser) {
      return NextResponse.json({ message: "Email does not exist" });
    }

    await prisma.user.update({
      where: {
        email: exisitingToken.email,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: exisitingToken.id,
      },
    });

    await createSession(existingUser.id);

    return NextResponse.json({ message: "User has verified" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
};
