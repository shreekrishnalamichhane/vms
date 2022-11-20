import { Request, Response } from "express"
import ErrorService from "../services/ErrorService"
import RemoteImageService from "../services/RemoteImageService"
import ResponseService from "../services/ResponseService"
import UserService from "../services/UserService"
import VaccineService from "../services/VaccineService"
import VaccineValidation from "../validations/VaccineValidation"

const VaccineController = {
    index: async (req: Request, res: Response) => {
        try {
            let vaccines = await VaccineService.getAllVaccines()

            vaccines.forEach(e => {

            });
            return ResponseService.prepareResponse(res, true, 200, 'Success Index', vaccines)
        } catch (err: any) {
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    },
    store: async (req: Request, res: Response) => {
        try {
            // Validate Input Data
            VaccineValidation.VaccineStoreInputValidation.parse(req.body)

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
                mandatory: req.body.mandatory,
                userId: req.body.userId,
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
            return ErrorService.handleError(res, err)
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            // Validate Input Data
            VaccineValidation.VaccineUpdateInputValidation.parse(req.body)

            // Look for the existing vaccine with provided id
            let vaccine = await VaccineService.getVaccine(Number(req.params.id))
            if (vaccine) { // If vaccine exixts, proceed

                if (req.body.image) {
                    // Try to delete the remote image
                    RemoteImageService.delete(vaccine!.image);
                }
                // Prepare Data
                let data = {
                    name: req.body.name,
                    description: req.body.description,
                    image: req.body.image ? await RemoteImageService.upload(String(req.body.image)) : String(vaccine!.image),
                    numberOfDoses: req.body.numberOfDoses,
                    manufacturer: req.body.manufacturer,
                    developedYear: req.body.developedYear,
                    ageGroup: req.body.ageGroup,
                    sideEffects: req.body.sideEffects,
                    mandatory: req.body.mandatory,
                    userId: req.body.userId,
                }

                // Assign and update the existing vaccine
                let vaccineUpdate = await VaccineService.updateVaccine(data, Number(req.params.id))

                // Return the success response
                return ResponseService.prepareResponse(res, true, 200, 'Success Update', vaccineUpdate)
            }

            // Fallback
            return ResponseService.prepareResponse(res, false, 404, 'Not Found', {})
        } catch (err: any) {
            return ErrorService.handleError(res, err)
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            // Look for the existing vaccine with provided id
            let vaccine = await VaccineService.getVaccine(Number(req.params.id))
            if (vaccine) { // If vaccine exists, proceed
                // Try to delete the associated image
                RemoteImageService.delete(vaccine!.image);

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
    },
    show: async (req: Request, res: Response) => {
        try {
            // Look for the existing vaccine with provided id
            let vaccine = await VaccineService.getVaccine(Number(req.params.id))
            if (vaccine) { // If vaccine exists, proceed

                // Return the success response
                return ResponseService.prepareResponse(res, true, 200, 'Success Show', vaccine)
            }

            //Fallback - Vaccine not found
            return ResponseService.prepareResponse(res, false, 404, 'Not Found', {})
        } catch (err: any) {
            return ResponseService.prepareResponse(res, false, 500, 'Server Error', {})
        }
    }
}

export default VaccineController