import { PrismaClient } from "@prisma/client";
import FarmPlantedCrop from '../models/farmPlantedCrop.model';
import IFarmPlantedCropRepository, { IChartData } from "./interfaces/IFarmPlantedRepository";

export default class FarmPlantedCropRepository implements IFarmPlantedCropRepository {
    private dataContext;
    constructor(dataContext: PrismaClient) {
        this.dataContext = dataContext;
    }

    async findAll(farmId?: number): Promise<FarmPlantedCrop[]> {
        if (farmId) return await this.dataContext.farmPlantedCrop.findMany({ where: { farmId } });
        const plantedCrops = await this.dataContext.farmPlantedCrop.findMany();
        return plantedCrops;
    }

    async find(id: number): Promise<FarmPlantedCrop | null>{
        const farmPlantedCrop = await this.dataContext.farmPlantedCrop.findFirst({
            where: {
                id,
            }
        });

        return farmPlantedCrop;
    }

    async create(farmPlantedCrop: FarmPlantedCrop): Promise<FarmPlantedCrop>{
        return this.dataContext.farmPlantedCrop.create({
            data: farmPlantedCrop,
        });
    }

    async update(id: number, farmPlantedCrop: FarmPlantedCrop): Promise<FarmPlantedCrop>{
        return await this.dataContext.farmPlantedCrop.update({
            where: {
                id,
            },
            data: farmPlantedCrop,
        });
    }

    async delete(id: number): Promise<void>{
        await this.dataContext.farmPlantedCrop.delete({
            where: {
                id,
            }
        });
    }

    async farmsPerPlantedCrop(): Promise<IChartData> {
        const data = await this.dataContext.farmPlantedCrop.groupBy({
            by: ['plantedCrop'],
            _count: {
                farmId: true,
            },
            having: {
                farmId: {
                    _count: {
                        gt: 0,
                    }
                }
            }
        });

        const plantedCrops: IChartData = {};

        for (const group of data) {
            plantedCrops[group.plantedCrop] = group._count.farmId;
        }

        return plantedCrops;
    }
}