import { User } from "@prisma/client";
import { Request, Response } from "express"
import ResponseService from "../services/ResponseService";
import UserService from "../services/UserService";

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

        } catch (err: any) {

        }
    },
    refresh: async (req: Request, res: Response) => {
        try {

        } catch (err: any) {

        }
    },

}

export default AuthController