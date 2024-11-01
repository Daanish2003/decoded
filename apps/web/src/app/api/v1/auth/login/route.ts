import { LoginSchema } from "@/zod/auth/loginSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/email";
import { getUserByEmail } from "@/utils/getUser";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { getTwoFactorTokenByEmail } from "@/utils/getTokens";
import { createTwoFactorConfirmation, deleteTwoFactorConfirmation, deleteTwoFactorToken } from "@/lib/twoFactor";
import { getTwoFactorConfirmationByUserId } from "@/utils/getConfirmation";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ message: validatedFields.error }, { status: 400 });
    }

    const { email, password, code } = validatedFields.data;

    // check for existing user
    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json({
        message: "Email does not exist",
      });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return NextResponse.json({
        message: "Invalid Password",
      });
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
          )
      await sendVerificationEmail({ token: verificationToken.token, email: verificationToken.email });

      return NextResponse.json({ message: "Confirmation mail sent" });
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

        if (!twoFactorToken) {
          return NextResponse.json({ message: "Invalid code" });
        }

        if (twoFactorToken.token !== code) {
          return NextResponse.json({ message: "invalid code" });
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return NextResponse.json({
            error: "Code has expired",
          });
        }

        await deleteTwoFactorToken(twoFactorToken.id)

        const exisitingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (exisitingConfirmation) {
          await deleteTwoFactorConfirmation(exisitingConfirmation.id)
          };
        }

        await createTwoFactorConfirmation(existingUser.id)
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email)

        await sendTwoFactorTokenEmail({
          token: twoFactorToken.token,
          email: twoFactorToken.email,
        });

        return NextResponse.json({ message: "code has been send" });
    }

    await createSession(existingUser.id);

    return NextResponse.json({ message: "User loggedin Successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 401 });
  }
};
