import { Router } from "express";
import { createTeam, getTeamById, getAllTeams, updateTeam, deleteTeam } from "./team.controller";
import { validate } from "../middleware/validate";
import { createTeamSchema, updateTeamSchema } from "./team.schema";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /teams: {
 * post: {
 *  summary: "Create a new team",
 *  tags: ["Teams"],
 *  security: [{ "bearerAuth": [] }],
 *  requestBody: {
 *    content: {
 *      "application/json": {
 *        schema: {
 *          type: "object",
 *          properties: {
 *            name: { type: "string" },
 *            memberIds: {
 *              type: "array",
 *              items: { type: "integer" }
 *            }
 *          },
 *          required: ["name"]
 *        }
 *      }
 *    }
 *  },
 *  responses: {
 *    201: { description: "Team created successfully" },
 *    400: { description: "Validation failed" }
 *  } 
 * }
 */
router.post("/", authenticate, validate(createTeamSchema), createTeam);

/**
 * @swagger
 * /teams/{id}: {
 *  get: {
 *    summary: "Get team by ID",
 *    tags: ["Teams"],
 *    security: [{ "bearerAuth": [] }],
 *    parameters: [
 *      {
 *        name: "id",
 *        in: "path",
 *        required: true,
 *        schema: { type: "integer" }
 *      }
 *    ],
 *    responses: {
 *      200: { description: "Team retrieved successfully" },
 *      404: { description: "Team not found" }
 *    }
 *  }
 * }
 */
router.get("/:id", authenticate, getTeamById);

/**
 * @swagger
 * /teams: {
 * get: {
 *    summary: "Get all teams",
 *    tags: ["Teams"],
 *    security: [{ "bearerAuth": [] }]
 *  responses: {
 *   200: { description: "Teams retrieved successfully" }
 *  }
 * }
 */
router.get("/", authenticate, getAllTeams);

/**
 * @swagger
 * /teams/{id}: {
 *  patch: {
 *    summary: "Update team",
 *    tags: ["Teams"],
 *    security: [{ "bearerAuth": [] }],
 *    parameters: [{
 *        name: "id",
 *        in: "path",
 *        required: true,
 *        schema: { type: "integer" }
 *    }],
 *    requestBody: {
 *      content: {
 *        "application/json": {
 *          schema: {
 *            type: "object",
 *            properties: {
 *              name: { type: "string" },
 *              memberIds: {
 *                type: "array",
 *                items: { type: "integer" }
 *              }
 *            }
 *          }
 *        }
 *      }
 *    },
 *    responses: {
 *      200: { description: "Team updated successfully" },
 *      400: { description: "Validation failed" },
 *      404: { description: "Team not found" }
 *    }
 *  }
 * }
 */
router.patch("/:id", authenticate, validate(updateTeamSchema), updateTeam);

/**
 * @swagger
 * /teams/{id}: {
 *  delete: {
 *    summary: "Delete team",
 *    tags: ["Teams"],
 *    security: [{ "bearerAuth": [] }],
 *    parameters: [{
 *        name: "id",
 *        in: "path",
 *        required: true,
 *        schema: { type: "integer" }
 *    }],
 *    responses: {
 *      204: { description: "Team deleted successfully" },
 *      404: { description: "Team not found" }
 *    }
 *  }
 * }
 */
router.delete("/:id", authenticate, deleteTeam);

export default router;