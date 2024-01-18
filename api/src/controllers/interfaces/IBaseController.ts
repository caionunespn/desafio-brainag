import { Request, Response } from "express";

export interface IOperationResponse {
    ok: boolean;
}

export default interface IBaseCRUDController<T> {
    findAll: (request: Request, response: Response) => Promise<Response<T[]>>;
    find: (request: Request, response: Response) => Promise<T | null>;
    create: (request: Request, response: Response) => Promise<IOperationResponse>;
    update: (request: Request, response: Response) => Promise<IOperationResponse>;
    delete: (request: Request, response: Response) => Promise<IOperationResponse>;
}