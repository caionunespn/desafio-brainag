// @ts-ignore
import fakerBR from "faker-br";
import { PrismaClient } from "@prisma/client";
import { fakerPT_BR as faker } from "@faker-js/faker";
import EntityRepository from "../../repositories/entity.repository";
import FarmRepository from "../../repositories/farm.repository";
import FarmPlantedCropRepository from "../../repositories/farmPlantedCrop.repository";
import ProducerRepository from "../../repositories/producer.repository";
import Entity from "../entity.model";
import Farm from "../farm.model";
import FarmPlantedCrop, { TFarmPlantedCrop } from "../farmPlantedCrop.model";

const createRandomEntity = (randomNumber: number): Entity => {
    return {
        name: faker.person.fullName(),
        cpfCnpj: randomNumber % 2 === 0 ? fakerBR.br.cnpj() : fakerBR.br.cpf(),
    }   
};

const createRandomFarm = (): Farm => {
    const totalArea = faker.number.float({
        min: 20,
        max: 500,
    });
    return {
        name: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state(),
        totalArea,
        arableArea: faker.number.float({
            min: 10,
            max: totalArea / 2
        }),
        vegetationArea: faker.number.float({
            min: 10,
            max: totalArea / 2
        })
    }   
};

const createRandomPlantedCrop = (farmId: number): FarmPlantedCrop => {
    const plantedCrops = ["SOY", "CORN", "COTTON", "COFFEE", "SUGARCANE"];
    return {
        farmId,
        plantedCrop: plantedCrops[faker.number.int({ min: 0, max: 4 })] as TFarmPlantedCrop,
    }   
}

export default async() => {
    try {
        console.log("Checking database population");
        const prisma = new PrismaClient();
        const producerRepository = new ProducerRepository(prisma);

        const producers = await producerRepository.findAll();

        if (producers.length <= 0) {
            console.log("Starting database population");
            const entityRepository = new EntityRepository(prisma);
            const farmRepository = new FarmRepository(prisma);
            const farmPlantedCropRepository = new FarmPlantedCropRepository(prisma);

            for (let i = 0; i < 30; i++) {
                const newEntity = await entityRepository.create(createRandomEntity(i));
                const newFarm = await farmRepository.create(createRandomFarm());
                
                for (let j = 0; j < faker.number.int({min: 1, max: 3}); j++) {
                    await farmPlantedCropRepository.create(createRandomPlantedCrop(newFarm.id as number));
                }

                await producerRepository.create({
                    entityId: newEntity.id as number,
                    farmId: newFarm.id as number,
                });
            }

            console.log("Database populated");
        }
    } catch (err) {
        console.warn(err);
    }
}