import Base from "./base.model";
import FarmPlantedCrop from "./farmPlantedCrop.model";

class Farm extends Base {
    public name!: string;
    public city!: string;
    public state!: string;
    public totalArea!: number; 
    public arableArea!: number;
    public vegetationArea!: number;
    public plantedCrops?: FarmPlantedCrop[] | object;

    constructor(props: Omit<Farm, "id">, id?: number) {
        super();
        const { name, city, state, totalArea, arableArea, vegetationArea } = props;
        Object.assign(this, { name, city, state, totalArea, arableArea, vegetationArea });

        if (id) {
            this.id = id;
        }
    }
}

export default Farm;