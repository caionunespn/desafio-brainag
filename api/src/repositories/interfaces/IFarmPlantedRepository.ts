import FarmPlantedCrop from "../../models/farmPlantedCrop.model";
import IBaseRepository from "./IBaseRepository";

export interface IChartData {
    [key: string]: number;
}

export default interface IFarmPlantedCropRepository extends IBaseRepository<FarmPlantedCrop> {
    farmsPerPlantedCrop: () => Promise<IChartData>;
}