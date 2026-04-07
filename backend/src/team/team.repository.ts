import prisma from "../lib/prisma";

export async function createTeam(name: string, memberIds?: number[]) {
    return await prisma.team.create({
        data: {
            name,
            members: memberIds ? { connect: memberIds.map(id => ({ id })) } : undefined,
        },
        include: {
            members: true,
        },
    });
}

export async function findTeamById(id: number) {
    return await prisma.team.findUnique({
        where: { id },
        include: {
            members: true,
        },
    });
}

export async function findAllTeams() {
    return await prisma.team.findMany({
        include: {
            members: true,
        },
    });
}

export async function updateTeam(id: number, name?: string, memberIds?: number[]) {
    return await prisma.team.update({
        where: { id },
        data: {
            name,
            members: memberIds ? { set: memberIds.map(id => ({ id })) } : undefined,
        },
        include: {
            members: true,
        },
    });
}

export async function deleteTeam(id: number) {
    return await prisma.team.delete({
        where: { id },
    });
}