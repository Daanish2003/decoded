import { deleteSession } from "@/lib/session"
import { redirect } from "next/dist/server/api-utils"
import { NextResponse } from "next/server"

export const POST = () => {
    deleteSession()
    return NextResponse.json({message: "logged out"})
}