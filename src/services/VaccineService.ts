import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { TypeVaccine } from "../@types/types";
import ImageService from "./ImageService";

import dotenv from "dotenv";
dotenv.config()

const VaccineService = {
    // Function to fetch all the vaccines
    getAllVaccines: async () => {
        try {
            // Try to fetch all the vaccines 
            return await prisma.vaccine.findMany({
                include: {
                    User: true
                }
            });
        } catch (err: any) {
            throw err
        }
    },

    // Function to store a new vaccine
    storeVaccine: async (vaccine: TypeVaccine) => {
        try {

            // Try to create a new vaccine 
            return await prisma.vaccine.create({
                data: {
                    name: vaccine.name.toString(),
                    description: vaccine.description.toString(),
                    image: ImageService.saveImageToFileSystem(vaccine.image, './public/images/'),
                    numberOfDoses: vaccine.numberOfDoses ? Number(vaccine.numberOfDoses) : null,
                    manufacturer: vaccine.manufacturer ? vaccine.manufacturer.toString() : null,
                    developedYear: vaccine.developedYear ? Number(vaccine.developedYear) : null,
                    ageGroup: vaccine.ageGroup ? vaccine.ageGroup.toString() : null,
                    sideEffects: vaccine.sideEffects ? vaccine.sideEffects.toString() : null,
                    userId: vaccine.userId ? Number(vaccine.userId) : null,
                },
                select: {
                    name: true,
                    description: true,
                    image: true,
                    numberOfDoses: true,
                    manufacturer: true,
                    developedYear: true,
                    ageGroup: true,
                    sideEffects: true,
                    userId: true,
                }
            })
        } catch (err: any) {
            throw err
        }
    },

    // Function to update a existing vaccine
    updateVaccine: async (vaccine: TypeVaccine, vaccineId: number) => {
        try {
            // Update the vaccine
            return await prisma.vaccine.update({
                where: {
                    id: vaccineId
                },
                data: {
                    name: vaccine.name.toString(),
                    description: vaccine.description.toString(),
                    image: vaccine.image.toString(),
                    numberOfDoses: vaccine.numberOfDoses ? Number(vaccine.numberOfDoses) : null,
                    manufacturer: vaccine.manufacturer ? vaccine.manufacturer.toString() : null,
                    developedYear: vaccine.developedYear ? Number(vaccine.developedYear) : null,
                    ageGroup: vaccine.ageGroup ? vaccine.ageGroup.toString() : null,
                    sideEffects: vaccine.sideEffects ? vaccine.sideEffects.toString() : null,
                    userId: vaccine.userId ? Number(vaccine.userId) : null,
                },
                select: {
                    name: true,
                    description: true,
                    image: true,
                    numberOfDoses: true,
                    manufacturer: true,
                    developedYear: true,
                    ageGroup: true,
                    sideEffects: true,
                    userId: true,
                }
            })
        } catch (err: any) {
            throw err
        }
    },

    // Function to get a single vaccine specified by the provided vaccineId
    getVaccine: async (vaccineId: number) => {
        // Fetch the vaccine with the provided vaccineId
        return await prisma.vaccine.findFirst({
            where: {
                id: vaccineId
            }
        })
    },

    // Function to delete a vaccine specified by the provided vaccineId
    deleteVaccine: async (vaccineId: number) => {
        // Delete the vaccine with the provided vaccineId
        return await prisma.vaccine.delete({
            where: {
                id: vaccineId
            }
        })
    }
}

export default VaccineService