import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { Request, Response } from "express"
import ImageService from "../services/ImageService"
import ResponseService from "../services/ResponseService"
import UserService from "../services/UserService"
import VaccineService from "../services/VaccineService"

const VaccineController = {
    index: async (req: Request, res: Response) => {
        try {
            let vaccines = await VaccineService.getAllVaccines()

            vaccines.forEach(e => {

            });
            return ResponseService.prepareResponse(res, true, 200, 'Success Index', vaccines)
        } catch (err: any) {
            console.log(err)
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    },
    store: async (req: Request, res: Response) => {
        try {
            // Validate Input Data

            // Get the User Instance with provided userId
            let user = await UserService.getUserById(req.body.userId);
            if (!user) {
                return ResponseService.prepareResponse(res, false, 401, 'Unauthorized', {})
            }

            // Prepare Data
            let data = {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                numberOfDoses: req.body.numberOfDoses,
                manufacturer: req.body.manufacturer,
                developedYear: req.body.developedYear,
                ageGroup: req.body.ageGroup,
                sideEffects: req.body.sideEffects,
                userId: req.body.userId
            }

            // Assign and create a new vaccine
            let vaccine = await VaccineService.storeVaccine(data)

            // If vaccine create is a success, return success response
            if (vaccine) {
                return ResponseService.prepareResponse(res, true, 200, 'Success Store', vaccine)
            }

            // Fallback
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        } catch (err: any) {
            console.log(err)
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            // Validate Input Data

            // Look for the existing vaccine with provided id
            let vaccine = await VaccineService.getVaccine(Number(req.params.id))
            if (vaccine) { // If vaccine exixts, proceed

                if (req.body.image) {
                    // Try to delete the associated image
                    ImageService.deleteImageFromFileSystem('./public/' + vaccine!.image)
                }
                // Prepare Data
                let data = {
                    name: req.body.name,
                    description: req.body.description,
                    image: req.body.image ? ImageService.saveImageToFileSystem(req.body.image, './public/images/') : String(vaccine!.image),
                    numberOfDoses: req.body.numberOfDoses,
                    manufacturer: req.body.manufacturer,
                    developedYear: req.body.developedYear,
                    ageGroup: req.body.ageGroup,
                    sideEffects: req.body.sideEffects,
                    userId: req.body.userId
                }

                // Assign and update the existing vaccine
                await VaccineService.updateVaccine(data, Number(req.params.id))

                // Return the success response
                return ResponseService.prepareResponse(res, true, 200, 'Success Update', vaccine)
            }

            // Fallback
            return ResponseService.prepareResponse(res, false, 404, 'Not Found', {})
        } catch (err: any) {
            if (err instanceof PrismaClientKnownRequestError) {
                return ResponseService.prepareResponse(res, false, 400, String(err!.meta!.cause), err)
            }
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            // Look for the existing vaccine with provided id
            let vaccine = await VaccineService.getVaccine(Number(req.params.id))
            if (vaccine) { // If vaccine exists, proceed
                // Try to delete the associated image
                ImageService.deleteImageFromFileSystem('./public/' + vaccine!.image)

                // Delete the database instance
                await VaccineService.deleteVaccine(Number(req.params.id))

                // Return the success response
                return ResponseService.prepareResponse(res, true, 200, 'Success Delete', {})
            }

            //Fallback - Vaccine not found
            return ResponseService.prepareResponse(res, false, 404, 'Not Found', {})
        } catch (err: any) {
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    }
}

export default VaccineController