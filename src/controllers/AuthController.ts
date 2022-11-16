import { User } from "@prisma/client";
import { Request, Response } from "express"
import Helpers from "../helpers/helpers";
import RefreshTokenService from "../services/RefreshTokenService";
import ResponseService from "../services/ResponseService";
import UserService from "../services/UserService";

const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME || "vms_access_token";
const REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME || "vms_refresh_token";

const AuthController = {
    // Function for signup
    signup: async (req: Request, res: Response) => {
        try {
            // Getting the body of the request
            // Expected Type : TypeSignin
            const data = req.body;

            // Look for the user with the requested email
            const user = await UserService.getUserByEmail(data.email);

            if (!user) { // If no user found, create one
                const newUser = await UserService.createUser(data);
                return ResponseService.prepareResponse(res, true, 201, 'Account Created', newUser);
            }
            else { // If user already exists, return error
                return ResponseService.prepareResponse(res, false, 409, 'Email Already Exists', null);
            }
        } catch (err: any) { // Catch the error
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', null);
        }
    },
    signin: async (req: Request, res: Response) => {
        try {
            // Getting the body of the request
            // Expected Type : TypeSignin
            const data = req.body;

            // data Validation 


            // Look for the user with the requested email
            let user = await UserService.getUserByEmail(data.email);

            // If no user exists with the email, send error response
            if (!user) {
                return ResponseService.prepareResponse(res, false, 422, 'Invalid Email or Password', {})
            }

            // If user email exists, then match the password
            const isPasswordMatch = await UserService.comparePassword(data.password, user.password);

            // If password not matched, then return error response
            if (isPasswordMatch === false) {
                return ResponseService.prepareResponse(res, false, 422, 'Invalid Email or Password', {})
            }

            // If user is authenticated, continue the login process
            // Prepare the token payload
            const payload = {
                'id': user.id,
                'email': user.email
            }

            // Generate the tokens
            let token = await UserService.generateTokens(payload)

            // Save the refresh token to database
            let tokenSaveSuccess = await UserService.saveRefreshToken(token.refreshToken, token.refreshTokenExpire, user.id);

            // If token saving was successful
            if (tokenSaveSuccess) {

                // Set up Access Token
                res.cookie(ACCESS_TOKEN_NAME, token.accessToken, {
                    httpOnly: true,
                    // domain: process.env.APP_URL || 'localhost',
                    secure: process.env.NODE_ENV === "production",
                    maxAge: Helpers.timeConvert(Number(process.env.ACCESS_TOKEN_EXPIRE) || 15, 'm') * 1000, //5mins
                });

                // Set up Refresh Token
                res.cookie(REFRESH_TOKEN_NAME, token.refreshToken, {
                    httpOnly: true,
                    // domain: process.env.APP_URL || 'localhost',
                    secure: process.env.NODE_ENV === "production",
                    maxAge: Helpers.timeConvert(Number(process.env.REFRESH_TOKEN_EXPIRE) || 30, 'd') * 1000, //5mins
                });

                // Send the login response with access and refresh tokens
                return ResponseService.prepareResponse(res, true, 200, "Login Successful", {
                    "accessToken": token.accessToken,
                    "refreshToken": token.refreshToken,
                    "accessTokenExpire": token.accessTokenExpire,
                    "refreshTokenExpire": token.refreshTokenExpire,
                    "user": Helpers.removeSecretFields(user, ['password', 'phone'])
                })
            }

            // FailSafe
            return ResponseService.prepareResponse(res, false, 500, "Server Error", {})

        } catch (err: any) {
            console.log(err)
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    },
    me: async (req: Request, res: Response) => {
        try {
            let user = await UserService.getUserById(req.body.userId);
            ResponseService.prepareResponse(res, true, 200, 'Profile Data', Helpers.removeSecretFields(user, ['password']))
        } catch (err: any) {
            ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    }

}

export default AuthController