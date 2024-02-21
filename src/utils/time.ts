import timestring from "timestring";

export function parseStringToTime(value: string) {
    if (value) {
        return timestring(value.includes(',') ? value.replace(',', '.') : value);
    }
}