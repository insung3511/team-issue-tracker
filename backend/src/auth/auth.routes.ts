import { Router } from "express"
import { register, login, getMe, updateProfile } from "./auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, updateProfileSchema } from "./auth.schema";
import { authenticate } from "../middleware/auth.middleware";


const router = Router();

/**
 * @swagger
 * /auth/me: {
 *  get: {
 *     summary: "Get current user info",
 *     tags: ["Auth"],
 *     security: [{ "bearerAuth": [] }],
 *     responses: {
 *      200: { description: "User info retrieved successfully" },
 *      401: { description: "Unauthorized" }
 *     }
 *    }
 *   }
 * }
 */
router.get("/me", authenticate, getMe);

/**
 * @swagger
 * /auth/profile: {
 *  patch: {
 *     summary: "Update current user profile",
 *     tags: ["Auth"],
 *     security: [{ "bearerAuth": [] }],
 *     requestBody: {
 *       content: {
 *         "application/json": {
 *           schema: {
 *             type: "object",
 *             properties: {
 *               name: { type: "string" },
 *               email: { type: "string" },
 *               password: { type: "string" },
 *               avatar: { type: "string" }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     responses: {
 *      200: { description: "Profile updated successfully" },
 *      400: { description: "Validation failed" },
 *      409: { description: "Email already in use" }
 *     }
 *    }
 *   }
 * }
 */
router.patch("/profile", authenticate, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /auth/register: {
 *   post: {
 *     summary: "Register a new user",
 *     tags: ["Auth"],
 *     requestBody: {
 *       required: true,
 *       content: {
 *         "application/json": {
 *           schema: {
 *             type: "object",
 *             required: ["name", "email", "password"],
 *             properties: {
 *               name: { type: "string", example: "John Doe" },
 *               email: { type: "string", example: "john@example.com" },
 *               password: { type: "string", example: "password123" }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     responses: {
 *       200: { description: "User registered successfully" },
 *       400: { description: "Validation failed" },
 *       409: { description: "Email already exists" }
 *     }
 *   }
 * }
 */
router.post("/register", validate(registerSchema), register);


/**
 * @swagger
 * /auth/login: {
 *   post: {
 *     summary: "Login a user",
 *     tags: ["Auth"],
 *     requestBody: {
 *       required: true,
 *       content: {
 *         "application/json": {
 *           schema: {
 *             type: "object",
 *             required: ["email", "password"],
 *             properties: {
 *               email: { type: "string", example: "john@example.com" },
 *               password: { type: "string", example: "password123" }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     responses: {
 *       200: { description: "User logged in successfully" },
 *       400: { description: "Validation failed" },
 *       401: { description: "Invalid email or password" }
 *     }
 *   }
 * }
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/profile: {
 *  patch: {
 *   summary: "Update current user profile",
 *   tags: ["Auth"],
 *   security: [{ "bearerAuth": [] }],
 *   requestBody: {
 *     content: {
 *       "application/json": {
 *         schema: {
 *           type: "object",
 *           properties: {
 *             name: { type: "string" },
 *             email: { type: "string" },
 *             password: { type: "string" },
 *             avatar: { type: "string" }
 *           }
 *         }
 *       }
 *     }
 *   },
 *   responses: {
 *     200: { description: "Profile updated successfully" },
 *     400: { description: "Validation failed" },
 *     409: { description: "Email already in use" },
 *   }
 * }
 */
router.patch("/profile", authenticate, validate(updateProfileSchema), updateProfile);

export default router;