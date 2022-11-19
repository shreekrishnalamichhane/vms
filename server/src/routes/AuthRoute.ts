import express, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import Auth from "../middlewares/AuthMiddleware";
const router = express.Router();

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.post('/signout', [Auth], AuthController.signout)
router.get('/me', [Auth], AuthController.me)
router.post('/profile', [Auth], AuthController.profile)


export default router;