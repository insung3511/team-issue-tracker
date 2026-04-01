import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { issueSchema, issueStatusUpdateSchema, issueUpdateSchema } from "./issue.schema";
import { 
    createIssue, 
    deleteIssue, 
    updateIssue, 
    updateIssueStatus,
    getIssueById,
    queryIssuesList,
 } from "./issues.controller";

const router = Router();

/**
 * @swagger
 * /issues: {
 *   post: {
 *     summary: "Create a new issue",
 *     tags: ["Issues"],
 *     security: [{ "bearerAuth": [] }],
 *     requestBody: {
 *       required: true,
 *       content: {
 *         "application/json": {
 *           schema: {
 *             type: "object",
 *             required: ["title"],
 *             properties: {
 *               title: { type: "string", example: "New issue" },
 *               description: { type: "string", example: "Description of the new issue" },
 *               priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     responses: {
 *       201: { description: "Issue created successfully" },
 *       400: { description: "Validation failed" },
 *       401: { description: "Unauthorized" }
 *     }
 *   }
 * }
 */
router.post("/", authenticate, validate(issueSchema), createIssue);

/** 
 * @swagger
 * /issues: {
 *   get: {
 *     summary: "Query issues list",
 *     tags: ["Issues"],
 *     security: [{ "bearerAuth": [] }],
 *     parameters: [
 *       { "in": "query", "name": "status", "schema": { "type": "string", "enum": ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] } },
 *       { "in": "query", "name": "priority", "schema": { "type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "URGENT"] } },
 *       { "in": "query", "name": "page", "schema": { "type": "integer", "default": 1 } },
 *       { "in": "query", "name": "limit", "schema": { "type": "integer", "default": 10 } }
 *     ],
 *     responses: {
 *       200: { description: "Issues retrieved successfully" },
 *       401: { description: "Unauthorized" }
 *     }
 *   }
 * }
 */
router.get("/", authenticate, queryIssuesList);

/**
 * @swagger
 * /issues/{id}: {
 *   get: {
 *     summary: "Get issue by ID",
 *     tags: ["Issues"],
 *     security: [{ "bearerAuth": [] }],
 *     responses: {
 *       200: { description: "Issue retrieved successfully" },
 *       401: { description: "Unauthorized" },
 *       404: { description: "Issue not found" }
 *     }
 *   }
 * }
 */
router.get("/:id", authenticate, getIssueById);

/**
 * @swagger
 * /issues/{id}: {
 *   delete: {
 *     summary: "Delete an issue",
 *     tags: ["Issues"],
 *     security: [{ "bearerAuth": [] }],
 *     responses: {
 *       204: { description: "Issue deleted successfully" },
 *       401: { description: "Unauthorized" },
 *       403: { description: "Forbidden (not the creator)" },
 *       404: { description: "Issue not found" }
 *     }
 *   }
 * }
 */
router.delete("/:id", authenticate, deleteIssue);

/**
 * @swagger
 * /issues/{id}: {
 *   patch: {
 *     summary: "Update an issue",
 *     tags: ["Issues"],
 *     security: [{ "bearerAuth": [] }],
 *     requestBody: {
 *       required: true,
 *       content: {
 *         "application/json": {
 *           schema: {
 *             type: "object",
 *             properties: {
 *               title: { type: "string", example: "Updated issue" },
 *               description: { type: "string", example: "Updated description" },
 *               priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     responses: {
 *       200: { description: "Issue updated successfully" },
 *       400: { description: "Validation failed" },
 *       401: { description: "Unauthorized" },
 *       404: { description: "Issue not found" }
 *     }
 *   }
 * }
 */
router.patch("/:id", authenticate, validate(issueUpdateSchema), updateIssue);

/**
 * @swagger
 * /issues/{id}/status: {
 *   patch: {
 *     summary: "Update issue status",
 *     tags: ["Issues"],
 *     security: [{ "bearerAuth": [] }],
 *     requestBody: {
 *       required: true,
 *       content: {
 *         "application/json": {
 *           schema: {
 *             type: "object",
 *             required: ["status"],
 *             properties: {
 *               status: { type: "string", enum: ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     responses: {
 *       200: { description: "Issue status updated successfully" },
 *       400: { description: "Validation failed (invalid transition)" },
 *       401: { description: "Unauthorized" },
 *       404: { description: "Issue not found" }
 *     }
 *   }
 * }
 */
router.patch("/:id/status", authenticate, validate(issueStatusUpdateSchema), updateIssueStatus);

export default router;