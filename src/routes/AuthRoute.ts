import express, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
const router = express.Router();

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.post('/refresh', AuthController.refresh)


export default router;