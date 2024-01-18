import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import IProducerController from "./interfaces/IProducerController";
import ProducerRepository from "../repositories/producer.repository";
import EntityRepository from "../repositories/entity.repository";
import FarmRepository from "../repositories/farm.repository";
import Entity from "../models/entity.model";
import Farm from "../models/farm.model";
import Producer from "../models/producer.model";
import { CustomError } from "../helpers/exceptions/custom.error";
import { HttpCode } from "../helpers/exceptions/constants.error";
import { handlePrismaError } from "../helpers/exceptions/database.error";
import FarmPlantedCropRepository from "../repositories/farmPlantedCrop.repository";
import FarmPlantedCrop from "../models/farmPlantedCrop.model";
import { isSamePlantedCrops } from "../helpers/validation";

export default class ProducerController implements IProducerController {
    private dataContext;
    private producerRepository;
    private entityRepository;
    private farmRepository;
    private farmPlantedCropRepository;

    constructor() {
        this.dataContext = new PrismaClient();
        this.producerRepository = new ProducerRepository(this.dataContext);
        this.entityRepository = new EntityRepository(this.dataContext);
        this.farmRepository = new FarmRepository(this.dataContext);
        this.farmPlantedCropRepository = new FarmPlantedCropRepository(this.dataContext);
    }

    findAll = async (request: Request, response: Response): Promise<any> => {
        try {
            const producers = await this.producerRepository.findAll();
            return response.status(HttpCode.OK).json(producers);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                err = handlePrismaError(err);
            }

            throw err;
        }
    }
    
    find = async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = request.params;

            const producer = await this.producerRepository.find(parseInt(id));

            if (!producer) {
                throw new CustomError({
                    name: "INVALID_PRODUCER",
                    description: "Producer not found",
                    httpCode: HttpCode.NOT_FOUND,
                });
            }

            return response.status(HttpCode.OK).json(producer);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                err = handlePrismaError(err);
            }

            throw err;
        }
    }
    
    create = async (request: Request, response: Response): Promise<any> => {
        try {
            const { entity: entityData, farm: farmBody } = request.body;
            const { plantedCrops, ...farmData } = farmBody;
            const entity = new Entity(entityData);
            const farm = new Farm(farmData);

            const newEntity = await this.entityRepository.create(entity);
            const newFarm = await this.farmRepository.create(farm);

            for (const plantedCropData of plantedCrops) {
                const plantedCrop = new FarmPlantedCrop({
                    farmId: newFarm.id as number,
                    plantedCrop: plantedCropData.plantedCrop,
                });
                await this.farmPlantedCropRepository.create(plantedCrop);
            }

            const producer = new Producer({
                entityId: newEntity.id as number,
                farmId: newFarm.id as number,
            });

            const newProducer = await this.producerRepository.create(producer);

            return response.status(HttpCode.OK).json(newProducer);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                err = handlePrismaError(err);
            }

            throw err;
        }
    }
    
    update = async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = request.params;

            const producer = await this.producerRepository.find(parseInt(id));

            if (!producer) {
                throw new CustomError({
                    name: "INVALID_PRODUCER",
                    description: "Producer not found",
                    httpCode: HttpCode.NOT_FOUND,
                });
            }

            const { entity: entityData, farm: farmBody } = request.body;
            const { plantedCrops, ...farmData } = farmBody;

            const entity = new Entity(entityData, producer.entityId);
            const farm = new Farm(farmData, producer.farmId);

            const oldPlantedCrops = producer?.farm?.plantedCrops ? producer.farm.plantedCrops as FarmPlantedCrop[] : [];

            const updatedEntity = await this.entityRepository.update(entity.id as number, entity);
            const updatedFarm = await this.farmRepository.update(farm.id as number, farm);

            producer.entity = updatedEntity;
            producer.farm = updatedFarm;

            let currentPlantedCrops = oldPlantedCrops;

            if (!isSamePlantedCrops(oldPlantedCrops, plantedCrops)) {
                for (const oldPlanted of oldPlantedCrops) {
                    await this.farmPlantedCropRepository.delete(oldPlanted.id as number);
                }
    
                const createdPlantedCrops = [];
    
                for (const newPlantedCropData of plantedCrops) {
                    const plantedCrop = new FarmPlantedCrop({
                        farmId: farm.id as number,
                        plantedCrop: newPlantedCropData.plantedCrop,
                    });
                    const createdPlantedCrop = await this.farmPlantedCropRepository.create(plantedCrop);
                    createdPlantedCrops.push(createdPlantedCrop);
                }

                currentPlantedCrops = createdPlantedCrops;
            }

            producer.farm.plantedCrops = currentPlantedCrops;

            return response.status(HttpCode.OK).json(producer);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                err = handlePrismaError(err);
            }

            throw err;
        }
    }
    
    delete = async (request: Request, response: Response): Promise<any> => {
        try {
            const { id } = request.params;

            const producer = await this.producerRepository.find(parseInt(id));

            if (!producer) {
                throw new CustomError({
                    name: "INVALID_PRODUCER",
                    description: "Producer not found",
                    httpCode: HttpCode.NOT_FOUND,
                });
            }

            const entityId = producer.entityId;
            const farmId = producer.farmId;

            const plantedCrops = producer?.farm?.plantedCrops ? producer.farm.plantedCrops as FarmPlantedCrop[] : [];

            for (const plantedCrop of plantedCrops) {
                await this.farmPlantedCropRepository.delete(plantedCrop.id as number);
            }

            await this.producerRepository.delete(parseInt(id));
            await this.entityRepository.delete(entityId);
            await this.farmRepository.delete(farmId);

            return response.status(204).json();
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                err = handlePrismaError(err);
            }

            throw err;
        }
    }
}