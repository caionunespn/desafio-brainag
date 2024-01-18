import { Request, Response } from "express";

export default interface IDashboardController  {
    getData: (request: Request, response: Response) => Promise<any>;
}