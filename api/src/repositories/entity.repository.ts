import { PrismaClient } from "@prisma/client";
import Entity from '../models/entity.model';
import IEntityRepository from './interfaces/IEntityRepository';

export default class EntityRepository implements IEntityRepository {
    private dataContext;
    constructor(dataContext: PrismaClient) {
        this.dataContext = dataContext;
    }

    async findAll(): Promise<Entity[]> {
        const entities = await this.dataContext.entity.findMany();
        return entities;
    }

    async find(id: number): Promise<Entity | null>{
        const entity = await this.dataContext.entity.findFirst({
            where: {
                id,
            }
        });

        return entity;
    }

    async create(entity: Entity): Promise<Entity>{
        return this.dataContext.entity.create({
            data: entity,
        });
    }

    async update(id: number, entity: Entity): Promise<Entity>{
        return await this.dataContext.entity.update({
            where: {
                id,
            },
            data: entity,
        });
    }

    async delete(id: number): Promise<void>{
        await this.dataContext.entity.delete({
            where: {
                id,
            }
        });
    }
}