import 'express-async-errors';
import express, {Request, Response, NextFunction} from "express";
import { errorHandler } from '../helpers/exceptions/handler.error';
import DashboardController from "../controllers/dashboard.controller";

const router = express.Router();

const dashboardController = new DashboardController();

router.get(
    "/dashboard",
    dashboardController.getData
);

router.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    errorHandler.handleError(err, response);
});

export default router;