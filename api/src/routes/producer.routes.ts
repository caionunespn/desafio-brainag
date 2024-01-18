import 'express-async-errors';
import express, {Request, Response, NextFunction} from "express";
import { param } from 'express-validator';
import { errorHandler } from '../helpers/exceptions/handler.error';
import ProducerController from "../controllers/producer.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import entityValidator from '../validators/entity.validator';
import farmValidator from '../validators/farm.validator';
import farmPlantedCropValidator from '../validators/farmPlantedCrop.validator';

const router = express.Router();

const producerController = new ProducerController();

router.get(
    "/producer",
    validationMiddleware,
    producerController.findAll
);
router.get(
    "/producer/:id",
    param("id").notEmpty().isInt({min: 1}),
    validationMiddleware,
    producerController.find
);
router.post(
    "/producer",
    entityValidator(),
    farmValidator(),
    farmPlantedCropValidator(),
    validationMiddleware,
    producerController.create
);
router.put(
    "/producer/:id",
    param("id").notEmpty().isInt({min: 1}),
    entityValidator(),
    farmValidator(),
    farmPlantedCropValidator(),
    validationMiddleware,
    producerController.update
);
router.delete(
    "/producer/:id",
    param("id").notEmpty().isInt({min: 1}),
    validationMiddleware,
    producerController.delete
);

router.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    errorHandler.handleError(err, response);
});

export default router;