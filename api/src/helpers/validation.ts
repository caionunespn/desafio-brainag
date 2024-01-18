import FarmPlantedCrop from "../models/farmPlantedCrop.model";

export const isValidCpfCnpj = (cpfCnpj: string) => {
    cpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
    if (cpfCnpj.length === 11) {
        return validateCpf(cpfCnpj);
    } else if (cpfCnpj.length === 14) {
        return validateCnpj(cpfCnpj);
    } else {
        return false;
    }
}

export const validateCpf = (cpf: string) => {
    cpf = cpf.toString().padStart(11, '0');

    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
}

export const validateCnpj = (cnpj: string) => {
    cnpj = cnpj.toString().padStart(14, '0');

    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
}

export const isSamePlantedCrops = (oldPlanted: FarmPlantedCrop[], newPlanted: FarmPlantedCrop[]) => {
    if (oldPlanted.length !== newPlanted.length) return false;

    const oldPlantedNames = oldPlanted.map((planted) => planted.plantedCrop);
    const newPlantedNames = newPlanted.map((planted) => planted.plantedCrop);

    let equals = true;

    for (const name of oldPlantedNames) {
        if (!newPlantedNames.includes(name)) {
            equals = false;
            break;
        }
    }

    return equals;
}