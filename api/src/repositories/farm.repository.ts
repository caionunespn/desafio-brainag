import { Prisma, PrismaClient } from "@prisma/client";
import Farm from '../models/farm.model';
import IFarmRepository, { IChartData } from './interfaces/IFarmRepository';

export default class FarmRepository implements IFarmRepository {
    private dataContext;
    constructor(dataContext: PrismaClient) {
        this.dataContext = dataContext;
    }

    async findAll(): Promise<Farm[]> {
        const farms = await this.dataContext.farm.findMany();
        return farms;
    }

    async find(id: number): Promise<Farm | null>{
        const farm = await this.dataContext.farm.findFirst({
            where: {
                id,
            }
        });

        return farm;
    }
    async create(farm: Farm): Promise<Farm>{
        return this.dataContext.farm.create({
            data: {
                ...farm,
                plantedCrops: farm.plantedCrops || {},
            }
        });
    }

    async update(id: number, farm: Farm): Promise<Farm>{
        return await this.dataContext.farm.update({
            where: {
                id,
            },
            data: {
                ...farm,
                plantedCrops: farm.plantedCrops || {},
            }
        });
    }

    async delete(id: number): Promise<void>{
        await this.dataContext.farm.delete({
            where: {
                id,
            },
        });
    }

    async totalFarms(): Promise<number> {
        return await this.dataContext.farm.count();
    }

    async totalArea(): Promise<number> {
        const sumAggregation = await this.dataContext.farm.aggregate({
            _sum: {
                totalArea: true,
            }
        });

        return sumAggregation._sum.totalArea || 0;
    }

    async farmsPerState(): Promise<IChartData> {
        const data = await this.dataContext.farm.groupBy({
            by: ['state'],
            _count: {
                id: true,
            },
            having: {
                id: {
                    _count: {
                        gt: 0,
                    }
                }
            }
        });

        const states: IChartData = {};

        for (const group of data) {
            states[group.state] = group._count.id;
        }

        return states;
    }

    async farmsPerUsedArea(): Promise<IChartData> {
        const sumAggregation = await this.dataContext.farm.aggregate({
            _sum: {
                arableArea: true,
                vegetationArea: true,
            }
        });

        return {
            arableArea: sumAggregation._sum.arableArea || 0,
            vegetationArea: sumAggregation._sum.vegetationArea || 0,
        };
    }
}