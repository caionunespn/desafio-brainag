import { PrismaClient } from "@prisma/client";
import Producer from '../models/producer.model';
import IProducerRepository from './interfaces/IProducerRepository';

export default class ProducerRepository implements IProducerRepository {
    private dataContext;
    
    constructor(dataContext: PrismaClient) {
        this.dataContext = dataContext;
    }

    async findAll(): Promise<Producer[]> {
        const producers = await this.dataContext.producer.findMany({
            include: {
                entity: true,
                farm: {
                    include: {
                        plantedCrops: true,
                    }
                },
            },
        });
        return producers;
    }

    async find(id: number): Promise<Producer | null>{
        const producer = await this.dataContext.producer.findFirst({
            where: {
                id,
            },
            include: {
                entity: true,
                farm: {
                    include: {
                        plantedCrops: true,
                    }
                },
            }
        });
        return producer;
    }

    async create(producer: Producer): Promise<Producer>{
        const data = {
            entityId: producer.entityId,
            farmId: producer.farmId,
        }
        return this.dataContext.producer.create({
            data,
            include: {
                entity: true,
                farm: {
                    include: {
                        plantedCrops: true,
                    }
                },
            }
        });
    }

    async update(id: number, producer: Producer): Promise<Producer>{
        const data = {
            entityId: producer.entityId,
            farmId: producer.farmId,
        }
        return await this.dataContext.producer.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: number): Promise<void>{
        await this.dataContext.producer.delete({
            where: {
                id,
            }
        });
    }
}