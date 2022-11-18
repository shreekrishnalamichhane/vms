import { ZodError } from "zod";
import { Response } from "express";
import ResponseService from "./ResponseService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
const ErrorService = {
    handleError: (res: Response, err: any) => {
        if (err instanceof ZodError) return ErrorService.handleZodError(res, err)
        if (err instanceof PrismaClientKnownRequestError) return ErrorService.handlePrismaError(res, err)
        else return ErrorService.handleServerError(res, err)
    },
    handlePrismaError: (res: Response, err: PrismaClientKnownRequestError) => {
        return ResponseService.prepareResponse(res, false, 400, String(err!.meta!.cause), err)
    },
    handleZodError: (res: Response, err: ZodError) => {
        let flattenedErrorMsg = err.flatten().fieldErrors
        let errorMsg = Object.keys(flattenedErrorMsg)[0] + " : " + flattenedErrorMsg[Object.keys(flattenedErrorMsg)[0]];
        return ResponseService.prepareResponse(res, false, 422, errorMsg, err.flatten().fieldErrors);
    },
    handleServerError: (res: Response, err: any) => {
        return ResponseService.prepareResponse(res, false, 500, "Server Error", err)
    }
}
export default ErrorService