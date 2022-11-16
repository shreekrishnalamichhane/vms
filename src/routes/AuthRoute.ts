import express, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import Auth from "../middlewares/AuthMiddleware";
const router = express.Router();

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.get('/me', [Auth], AuthController.me)


export default router;