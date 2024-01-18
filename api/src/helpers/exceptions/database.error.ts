import { Prisma } from "@prisma/client";
import { CustomError } from "./custom.error";
import { HttpCode } from "./constants.error";

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
    switch (err.code) {
        case 'P2002':
            return new CustomError({
                name: 'DUPLICATE_KEY',
                description: `Duplicate field value: ${err.meta ? err.meta.target : "check body data"}`,
                httpCode: HttpCode.BAD_REQUEST,
            });
        case 'P2014':
            return new CustomError({
                name: 'INVALID_ID',
                description: `Invalid ID: ${err.meta ? err.meta.target : "check id"}`,
                httpCode: HttpCode.BAD_REQUEST,
            });
        case 'P2003':
            return new CustomError({
                name: 'INVALID_DATA',
                description: `Invalid data: ${err.meta ? err.meta.target : "check body data"}`,
                httpCode: HttpCode.BAD_REQUEST,
            });
        default:
            return new CustomError({
                name: 'DATABASE_ERROR',
                description: `Something went wrong: ${err.message}`,
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                isOperational: true,
            });
    }
};