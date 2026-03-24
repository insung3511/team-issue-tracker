import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { issueSchema } from "./issue.schema";
import { createIssue } from "./issues.controller";

const router = Router();

router.post("/", authenticate, validate(issueSchema), createIssue);

export default router;