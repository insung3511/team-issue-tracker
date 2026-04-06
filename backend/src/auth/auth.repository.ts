import prisma from "../lib/prisma";

export async function findUserById(id: number) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

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

export async function updateUser(id: number, data: { name?: string; email?: string; password?: string; avatar?: string }) {
    return await prisma.user.update({
        where: { id },
        data,
    });
}