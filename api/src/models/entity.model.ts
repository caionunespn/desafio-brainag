import Base from "./base.model";

class Entity extends Base {
    public name!: string;
    public cpfCnpj!: string;

    constructor(props: Omit<Entity, "id">, id?: number) {
        super();
        const { name, cpfCnpj } = props;
        Object.assign(this, { name, cpfCnpj });

        if (id) {
            this.id = id;
        }
    }
}

export default Entity;