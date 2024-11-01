import prisma from "@repo/db/client";

export async function getTwoFactorConfirmationByUserId(userId: string) {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });
    return twoFactorConfirmation;
  } catch (error) {
    console.log(error);
    return null;
  }
}
