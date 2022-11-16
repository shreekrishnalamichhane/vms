import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import ResponseService from "../services/ResponseService";
import Helpers from "../helpers/helpers";
import RefreshTokenService from "../services/RefreshTokenService";
import { JsonWebTokenError } from "jsonwebtoken";
dotenv.config();

const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME || "vms_access_token";
const REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME || "vms_refresh_token";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'this-is-a-random-text';
const ACCESS_TOKEN_EXPIRE = Number(process.env.ACCESS_TOKEN_EXPIRE) || 15;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'this-is-a-another-random-text';
const REFRESH_TOKEN_EXPIRE = Number(process.env.REFRESH_TOKEN_EXPIRE) || 30;


const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the accessToken and refreshToken
        let accessToken = req.cookies[ACCESS_TOKEN_NAME] || req.headers["authorization"]
        let refreshToken = req.cookies[REFRESH_TOKEN_NAME]

        if (!accessToken) {
            if (!refreshToken) {
                // If no tokens present in req, return 401
                return ResponseService.prepareResponse(res, false, 401, "Unauthorized", {})
            }

            // If refreshToken Exists, recreate a access token
            if (refreshToken) {
                // Decoding the refresh token
                const { id, email } = Helpers.decodeToken(refreshToken, REFRESH_TOKEN);
                let payload = {
                    id, email
                }

                // Apppend id to req.body as userId
                req.body.userId = id

                // Check for the validity of refresh token
                let refreshTokenDatabase = await RefreshTokenService.getToken(refreshToken, Number(id))
                if (refreshTokenDatabase) {
                    let newToken = await Helpers.createToken(payload, ACCESS_TOKEN, Helpers.timeConvert(ACCESS_TOKEN_EXPIRE, 'm') + 's')

                    // Set up Access Token
                    res.cookie(ACCESS_TOKEN_NAME, newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: Helpers.timeConvert(Number(process.env.ACCESS_TOKEN_EXPIRE) || 15, 'm') * 1000, //5mins
                    });
                }
            }
        }
        // Checks for accessToken
        if (accessToken) {
            const { id, email } = Helpers.decodeToken(accessToken, ACCESS_TOKEN);
            let payload = {
                id, email
            }

            // Apppend id to req.body as userId
            req.body.userId = id
        }
        next();
    } catch (err) {
        // JWT Token Verification Error
        if (err instanceof JsonWebTokenError) {
            return ResponseService.prepareResponse(res, false, 401, "Token Invalid", {})
        }
        // Fallback
        return ResponseService.prepareResponse(res, false, 500, "Server Error", {})
    }
}

export default AuthMiddleware