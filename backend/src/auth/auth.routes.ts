import { Router } from "express"
import { register, login, getMe } from "./auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "./auth.schema";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMe);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;