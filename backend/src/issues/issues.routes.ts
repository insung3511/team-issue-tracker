import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { issueSchema, issueUpdateSchema } from "./issue.schema";
import { createIssue, deleteIssue, updateIssue } from "./issues.controller";
import { getIssueById, getIssueByUserId } from "./issues.controller";

const router = Router();

router.post("/", authenticate, validate(issueSchema), createIssue);
router.get("/", authenticate, getIssueByUserId);
router.get("/:id", authenticate, getIssueById);
router.delete("/:id", authenticate, deleteIssue);
router.patch("/:id", authenticate, validate(issueUpdateSchema), updateIssue);

export default router;