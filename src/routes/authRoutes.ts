import express from "express";

import { login, logout } from "@/controllers/auth";

const router = express.Router();

router.post("/auth/login", login);
router.get("/auth/logout", logout);

export { router };
