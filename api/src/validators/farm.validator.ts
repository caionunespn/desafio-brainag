import { body } from "express-validator";

const farmValidator = () => {
    return [
        body(['farm.name', 'farm.city', 'farm.state'])
            .isString()
            .notEmpty().withMessage("Field is empty")
            .isLength({ min: 3 }).withMessage("Field has less then 3 characters"),
        body(['farm.totalArea', 'farm.arableArea', 'farm.vegetationArea']).isFloat({ min: 0 }).withMessage("Field cannot be negative"),
        body('farm').custom(value => value.arableArea + value.vegetationArea <= value.totalArea).withMessage("The sum of arable and vegetation areas cannot be bigger than total area")
    ];
}

export default farmValidator;