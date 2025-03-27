import { Router } from "express";
import * as controller from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.get("/me", requireAuth, controller.me);

export default router;
