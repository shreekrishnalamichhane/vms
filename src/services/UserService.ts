import { Prisma, PrismaClient } from "@prisma/client";
import { TypeSignin } from "../@types/types";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

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

    // Function to create a user with provided info
    createUser: async (userData: TypeSignin) => {
        try {
            // Generate password hash salt
            const salt = await bcrypt.genSalt();

            // Generate a password hash
            const pwdHash = await bcrypt.hash(userData.password.toString(), salt);

            // Create a user
            const user = await prisma.user.create({
                data: {
                    email: userData.email.toString(),
                    password: pwdHash
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
    }
}
export default UserService;