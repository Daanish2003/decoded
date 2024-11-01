import EmailVerificationTemplate from "@/components/emailVerificationTemplate";
import passwordResetTemplate from "@/components/passwordResetTemplate";
import TwoFactorEmailTemplate from "@/components/TwoFactorTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function sendVerificationEmail({ token, email }: { token: string; email: string }) {
    const confirmLink = `${BASE_URL}/auth/new-verification?token=${encodeURIComponent(token)}`;
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email",
      react: EmailVerificationTemplate(confirmLink),
    });
}

export const sendTwoFactorTokenEmail = async ({token, email}: {token: string; email: string}) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "2FA Code",
      react: TwoFactorEmailTemplate(token)
    });
  };

  export const sendPasswordResetEmail = async ({token, email}: {token: string; email: string}) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetLink = `${BASE_URL}/auth/new-password?token=${token}`
  
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password",
      react:passwordResetTemplate(resetLink)
    });
  };