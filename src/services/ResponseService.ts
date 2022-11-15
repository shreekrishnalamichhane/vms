import { Request, Response } from "express";
const ResponseService = {
    // Function to create a formatted consistent response
    prepareResponse: async (res: Response, success: boolean, statusCode: number, statusMessage: string, data: any) => {
        try {
            // Try to send the response
            return res.status(statusCode).json({
                success,
                statusCode,
                statusMessage,
                data
            })
        } catch (error) { // If unable send 400 response
            return res.status(400).json({
                success: false,
                statusCode: 400,
                statusMessage: "Bad Request.",
                data: {}
            })
        }
    }
}
export default ResponseService;