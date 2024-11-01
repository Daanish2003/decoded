import prisma from "@repo/db/client"

type NewUser = {
       id: string
       password: string | null
       email: string
}


export async function createUser(email: string, hashedPassword: string, name: string): Promise<NewUser | null> {
       try {
          const newUser = await prisma.user.create({
              select: {
                  id: true,
                  password: true,
                  email: true
              },
               data: {
                 email,
                 name,
                 password: hashedPassword,
               }
          })
          return newUser
       } catch (error) {
              console.log(error)
              return null
       }
}