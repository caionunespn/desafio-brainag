import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import FarmRepository from "../repositories/farm.repository";
import { HttpCode } from "../helpers/exceptions/constants.error";
import { handlePrismaError } from "../helpers/exceptions/database.error";
import FarmPlantedCropRepository from "../repositories/farmPlantedCrop.repository";
import IDashboardController from "./interfaces/IDashboardController";

export default class DashboardController implements IDashboardController {
    private dataContext;
    private farmRepository;
    private farmPlantedCropRepository;

    constructor() {
        this.dataContext = new PrismaClient();
        this.farmRepository = new FarmRepository(this.dataContext);
        this.farmPlantedCropRepository = new FarmPlantedCropRepository(this.dataContext);
    }

    getData = async (request: Request, response: Response): Promise<any> => {
        try {
            const totalFarms = await this.farmRepository.totalFarms();
            const totalArea = await this.farmRepository.totalArea();
            const farmsPerState = await this.farmRepository.farmsPerState();
            const farmsPerPlantedCrop = await this.farmPlantedCropRepository.farmsPerPlantedCrop();
            const farmsPerUsedArea = await this.farmRepository.farmsPerUsedArea();

            return response.status(HttpCode.OK).json({
                totalFarms,
                totalArea,
                farmsPerState,
                farmsPerPlantedCrop,
                farmsPerUsedArea,
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                err = handlePrismaError(err);
            }

            throw err;
        }
    }
}