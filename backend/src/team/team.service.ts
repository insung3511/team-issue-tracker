import {
  createTeam as createTeamRepo, 
  findTeamById as findTeamByIdRepo, 
  findAllTeams as findAllTeamsRepo, 
  updateTeam as updateTeamRepo, 
  deleteTeam as deleteTeamRepo 
} from "./team.repository";
import { AppError } from "../errors/AppError";
import { Team } from "../generated/prisma";

export async function createTeam(name: string, memberIds?: number[]): Promise<Team> {
    return await createTeamRepo(name, memberIds);
}

export async function getTeamById(id: number): Promise<Team> {
    const team = await findTeamByIdRepo(id);
    if (!team) {
        throw new AppError(404, "Team not found");
    }
    return team;
}

export async function getAllTeams(): Promise<Team[]> {
    return await findAllTeamsRepo();
}

export async function updateTeam(id: number, name?: string, memberIds?: number[]): Promise<Team> {
    const team = await findTeamByIdRepo(id);
    if (!team) {
        throw new AppError(404, "Team not found");
    }
    return await updateTeamRepo(id, name, memberIds);
}

export async function deleteTeam(id: number): Promise<void> {
    const team = await findTeamByIdRepo(id);
    if (!team) {
        throw new AppError(404, "Team not found");
    }
    await deleteTeamRepo(id);
}