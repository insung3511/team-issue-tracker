import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { 
  getIssueStatsOverview, 
  getIssueStatsByPriority, 
  getIssueStatsByAssignee 
} from "./stats.controller";

const router = Router();

router.get("/overview", authenticate, getIssueStatsOverview);
router.get("/by-priority", authenticate, getIssueStatsByPriority);
router.get("/by-assignee", authenticate, getIssueStatsByAssignee);

export default router;
