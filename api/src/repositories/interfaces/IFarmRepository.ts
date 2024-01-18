import Farm from "../../models/farm.model";
import IBaseRepository from "./IBaseRepository";

export interface IChartData {
    [key: string]: number;
}

export default interface IFarmRepository extends IBaseRepository<Farm> {
    totalFarms: () => Promise<number>;
    totalArea: () => Promise<number>;
    farmsPerState: () => Promise<IChartData>;
    farmsPerUsedArea: () => Promise<IChartData>;
}