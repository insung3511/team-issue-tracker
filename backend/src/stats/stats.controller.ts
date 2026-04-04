import { Request, Response, NextFunction } from "express";
import { 
  getIssueStatsOverview as getIssueStatsOverviewService, 
  getIssueStatsByPriority as getIssueStatsByPriorityService, 
  getIssueStatsByAssignee as getIssueStatsByAssigneeService 
} from "./stats.service";

export const getIssueStatsOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getIssueStatsOverviewService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getIssueStatsByPriority = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getIssueStatsByPriorityService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getIssueStatsByAssignee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getIssueStatsByAssigneeService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
