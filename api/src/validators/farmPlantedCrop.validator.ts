import { body } from "express-validator";
import { isPlantedCrop } from "../models/farmPlantedCrop.model";

const farmPlantedCropValidator = () => {
    return [
        body('farm.plantedCrops').exists().notEmpty(),
        body(['farm.plantedCrops.*.plantedCrop'])
            .isString()
            .notEmpty().withMessage("Field is empty")
            .isLength({ min: 3 }).withMessage("Field has less then 3 characters"),
        body('farm.plantedCrops.*.plantedCrop').custom(value => isPlantedCrop(value)),
    ];
}

export default farmPlantedCropValidator;