import express from "express";

import { login, loginAdmin, logout } from "@/controllers/auth";

const router = express.Router();

router.post("/auth/login", login);
router.get("/auth/logout", logout);

router.post("/auth/admin/loginAdmin", loginAdmin);

export { router };
