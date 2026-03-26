import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { issueSchema, issueStatusUpdateSchema, issueUpdateSchema } from "./issue.schema";
import { createIssue, deleteIssue, updateIssue, updateIssueStatus } from "./issues.controller";
import { getIssueById, getIssueByUserId } from "./issues.controller";

const router = Router();

router.post("/", authenticate, validate(issueSchema), createIssue);
router.get("/", authenticate, getIssueByUserId);
router.get("/:id", authenticate, getIssueById);
router.delete("/:id", authenticate, deleteIssue);
router.patch("/:id", authenticate, validate(issueUpdateSchema), updateIssue);
router.patch("/:id/status", authenticate, validate(issueStatusUpdateSchema), updateIssueStatus);

export default router;