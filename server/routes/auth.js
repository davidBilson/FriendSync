import express from "express";
import { login, register } from "../controllers/auth.js"

router.post("/login", login)