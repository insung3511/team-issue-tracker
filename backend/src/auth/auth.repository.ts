import prisma from "../lib/prisma";

export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(name: string, email: string, password: string) {
    return await prisma.user.create({
        data: {
            name,
            email,
            password,
        },
    });
}