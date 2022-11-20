import { Prisma, PrismaClient } from "@prisma/client";
import { TypeSignup, TypeSignin, TypeUpdateProfile } from "../@types/types";
import bcrypt from "bcrypt";
import Helpers from "../helpers/helpers";
import RefreshTokenService from "./RefreshTokenService";
const prisma = new PrismaClient();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'this-is-a-random-text';
const ACCESS_TOKEN_EXPIRE = Number(process.env.ACCESS_TOKEN_EXPIRE) || 15;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'this-is-a-another-random-text';
const REFRESH_TOKEN_EXPIRE = Number(process.env.REFRESH_TOKEN_EXPIRE) || 30;

const UserService = {
    // Function to get a user by provided email
    getUserByEmail: async (email: string) => {
        try {
            return await prisma.user.findFirst({
                where: {
                    email
                }
            })
        } catch (err: any) {
            throw err;
        }
    },

    // Function to get a user by provided id
    getUserById: async (id: number) => {
        try {
            return await prisma.user.findFirst({
                where: {
                    id
                }
            })
        } catch (err: any) {
            throw err;
        }
    },
    // Function to get a user by provided id
    getUserByEmailAndPassword: async (email: string, password: string) => {
        try {
            return await prisma.user.findFirst({
                where: {
                    email,
                    password
                }
            })
        } catch (err: any) {
            throw err;
        }
    },

    // Function to create a user with provided info
    createUser: async (userData: TypeSignup) => {
        try {
            // Generate password hash salt
            const salt = await bcrypt.genSalt();

            // Generate a password hash
            const pwdHash = await bcrypt.hash(userData.password.toString(), salt);

            // Create a user
            const user = await prisma.user.create({
                data: {
                    email: userData.email.toString(),
                    password: pwdHash,
                    name: userData.name.toString(),
                    phone: userData.phone.toString()
                },
                // Select some fields after create
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
            return user;
        } catch (err: any) {
            throw err;
        }
    },

    // Function to compare the plain password with its stored hash
    comparePassword: async (password: string, hash: string) => {
        return await bcrypt.compare(password, hash);
    },

    // Generate and Save tokens
    generateTokens: async (payload: any) => {
        return {
            "accessToken": await Helpers.createToken(payload, ACCESS_TOKEN, Helpers.timeConvert(ACCESS_TOKEN_EXPIRE, 'm') + 's'),
            "refreshToken": await Helpers.createToken(payload, REFRESH_TOKEN, Helpers.timeConvert(REFRESH_TOKEN_EXPIRE, 'd') + 's'),
            "accessTokenExpire": Helpers.addTime(ACCESS_TOKEN_EXPIRE, 'm'),
            "refreshTokenExpire": Helpers.addTime(REFRESH_TOKEN_EXPIRE, 'd'),
        }
    },

    // Function to store refresh token to database
    saveRefreshToken: async (token: string, expire: number, userId: number) => {
        try {
            return await RefreshTokenService.storeToken({
                token, expire, userId
            })
        } catch (error) {
            throw error;
        }
    },

    // Update User Profile
    updateUserProfile: async (data: TypeUpdateProfile, userId: number) => {
        try {
            return await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name: String(data.name),
                    phone: String(data.phone),
                }
            })
        } catch (err: any) {
            throw err;
        }
    }
}
export default UserService;