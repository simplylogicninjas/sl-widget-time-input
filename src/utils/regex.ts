export function isNumeric(value: string) {
    const number = Number(value.includes(',') ? value.replace(',', '.') : value);
    
    return !Number.isNaN(number);
}