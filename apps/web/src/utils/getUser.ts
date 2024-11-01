import prisma from "@repo/db/client"

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                emailVerified: true,
                password: true,
                role: true,
                isTwoFactorEnabled: true
            },
            where: {
                email
            }
        })
        return user
    } catch (error) {
        return null
    }
}