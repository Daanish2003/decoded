import prisma from "@repo/db/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

type SessionPayload = {
    userId: string;
    expiresAt: Date
}

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const {payload} = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });

        return payload
    } catch(error) {
        return null
    }
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    const session = await encrypt({userId, expiresAt});

    await prisma.session.create({
        data: {
          userId,
          sessionToken: session,
          expires: expiresAt,
        },
      });

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: "lax",
        path:"/"
    });
}

export async function verifySession() {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie);

    if(!session?.userId) {
        redirect('/login')
    }

    return { userId: session.userId }
}

export async function updateSession() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session)

    if(!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 100);

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: false,
        expires: expires,
        sameSite: 'lax',
        path: '/'
    })
}

export async function deleteSession() {
    (await cookies()).delete('session');
    redirect('/login')
}
