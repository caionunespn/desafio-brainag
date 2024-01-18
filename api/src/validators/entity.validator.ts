import { body } from "express-validator";
import { isValidCpfCnpj } from "../helpers/validation";

const entityValidator = () => {
    return [
        body('entity.name')
            .isString()
            .notEmpty().withMessage("Field is empty")
            .isLength({ min: 3 }).withMessage("Field has less then 3 characters"),
        body('entity.cpfCnpj').custom(value => isValidCpfCnpj(value)).withMessage("Invalid CPF/CNPJ"),
    ];
}

export default entityValidator;