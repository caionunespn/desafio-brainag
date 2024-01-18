import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helpers/exceptions/custom.error";
import { HttpCode } from "../helpers/exceptions/constants.error";
import { validationResult } from "express-validator";

const validationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const validationErrors = validationResult(request).array();
        if (validationErrors.length > 0) {
            const errorToThrow = validationErrors[0] as any;
            throw new CustomError({
                name: "INVALID_FIELD",
                description: `${errorToThrow.msg}: field ${errorToThrow.path}`,
                httpCode: HttpCode.BAD_REQUEST,
            })
        }

        next();
    } catch (err) {
        throw err;
    }
}

export default validationMiddleware;