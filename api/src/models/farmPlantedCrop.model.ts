import Base from "./base.model";
import Farm from "./farm.model";

const plantedCrops = ["SOY", "CORN", "COTTON", "COFFEE", "SUGARCANE"];
type PlantedCrop = (typeof plantedCrops)[number];
export const isPlantedCrop = (instance: any): instance is PlantedCrop => plantedCrops.includes(instance);

export type TFarmPlantedCrop = "SOY" | "CORN" | "COTTON" | "COFFEE" | "SUGARCANE";

class FarmPlantedCrop extends Base {
    public farmId!: number;
    public plantedCrop!: TFarmPlantedCrop;

    constructor(props: Omit<FarmPlantedCrop, "id">, id?: number) {
        super();
        const { farmId, plantedCrop } = props;
        Object.assign(this, { farmId, plantedCrop });

        if (id) {
            this.id = id;
        }
    }
}

export default FarmPlantedCrop;