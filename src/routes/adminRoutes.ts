import express from "express";
import { authentication, authorizeRoles } from "@/middlewares/authentication";
import {
    getAdmin
  } from "@/controllers/adminController";
  

const router = express.Router();

router.get(
    "/instructors/admin",
    authentication,
    authorizeRoles("admin"),
    getAdmin,
);
