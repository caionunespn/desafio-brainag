import Base from "./base.model";
import Entity from "./entity.model";
import Farm from "./farm.model";

class Producer extends Base {
    public entityId!: number;
    public entity?: Entity;
    public farmId!: number;
    public farm?: Farm;

    constructor(props: Omit<Producer, "id">, id?: number) {
        super();
        const { entityId, farmId } = props;
        Object.assign(this, { entityId, farmId });

        if (id) {
            this.id = id;
        }
    }
}

export default Producer;