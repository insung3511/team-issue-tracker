import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { 
    createComment, 
    getCommentsByIssueId, 
    updateComment, 
    deleteComment, 
    getCommentById 
} from "./comments.controller";
import { commentSchema, commentUpdateSchema } from "./comments.schema";

const router = Router();

router.post("/issues/:issueId/comments", authenticate, validate(commentSchema), createComment);
router.get("/issues/:issueId/comments", authenticate, getCommentsByIssueId);
router.get("/comments/:commentId", authenticate, getCommentById);
router.patch("/comments/:commentId", authenticate, validate(commentUpdateSchema), updateComment);
router.delete("/comments/:commentId", authenticate, deleteComment);

export default router;