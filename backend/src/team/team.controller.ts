import { Request, Response, NextFunction } from "express";
import {
  createTeam as createTeamService,
  getTeamById as getTeamByIdService,
  getAllTeams as getAllTeamsService,
  updateTeam as updateTeamService,
  deleteTeam as deleteTeamService,
} from "./team.service";

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, memberIds } = req.body;
    const team = await createTeamService(name, memberIds);
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await getTeamByIdService(req.userId!);
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const getAllTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamList = await getAllTeamsService();
    res.status(200).json({ success: true, data: teamList });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, memberIds } = req.body;
    const team = await updateTeamService(req.userId!, name, memberIds);
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTeamService(req.userId!);
    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};