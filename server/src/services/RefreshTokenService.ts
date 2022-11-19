import { Prisma, PrismaClient } from "@prisma/client";
import { Response } from "express";
const prisma = new PrismaClient();

const RefreshTokenService = {
    // Function thats actually responsible for storing 
    // the refresh token to database 
    storeToken: async (data: any) => {
        try {
            // Create a Refresh Token, and return
            return await prisma.refreshToken.create({
                data: {
                    token: data.token.toString(),
                    expireAt: data.expire,
                    userId: Number(data.userId)
                },
                // Select some fields after create
                select: {
                    id: true,
                    token: true,
                    expireAt: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
        } catch (err: any) {
            throw err;
        }
    },

    getToken: async (token: string, userId: number) => {
        try {
            return await prisma.refreshToken.findFirst({
                where: {
                    token,
                    userId,
                    expireAt: {
                        gte: Number(Date.now())
                    }
                }
            })
        } catch (err: any) {
            throw err;
        }
    },
    clearToken: (res: Response, name: string) => {
        // Clear up refreshToken
        return res.cookie(name, "", {
            maxAge: 1, // Immediately
        });
    },
    deleteToken: async (token: string) => {
        try {
            return await prisma.refreshToken.deleteMany({})
        } catch (err: any) {
            throw err;
        }
    }
}
export default RefreshTokenService