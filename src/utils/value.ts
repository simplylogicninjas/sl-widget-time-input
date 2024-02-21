export function cleanValue(value: string): string {
    return value.replace(/\s/g, '');
}

export function parseTimeValueToSeconds(value: string, validateSeconds?: boolean): number | null {
    const regex = /^((\d{1,2})?)(\:)(\d{1,2})$/;
    const regexResult = regex.exec(cleanValue(value));

    if (!regexResult) {
        return null;
    }

    let seconds = 0;

    const allGroup = regexResult[0];
    const hourGroup = regexResult.at(1);
    const minuteGroup = regexResult.at(4);

    if (!allGroup.includes(':') && allGroup.length <= 2) {
        seconds = +allGroup * 3600;

        if (!validateSeconds) {
            return seconds;
        }

        return seconds < 86400 ? seconds : null;
    }

    const hours = hourGroup ? regexResult.at(2) ?? 0 : 0;
    const minutes = minuteGroup ?? 0;

    seconds = (+hours * 3600) + (+minutes * 60);

    if (!validateSeconds) {
        return seconds;
    }

    return seconds < 86400 ? seconds : null;
}

export function parseNumberValueToSeconds(value: string, validateSeconds?: boolean): number | null {
    let valueToTest = cleanValue(value).includes(',') ? value.replace(',', '.') : value;
    valueToTest = valueToTest.includes('-') ? valueToTest.replace('-', '') : valueToTest;

    const integerRegex = /^\d+$/;
    const integerRegexResult = integerRegex.exec(valueToTest);

    if (integerRegexResult) {
        const seconds = +integerRegexResult[0] * 3600;

        if (!validateSeconds) {
            return seconds;
        }

        return seconds < 86400 ? seconds : null;
    }

    const decimalRegex = validateSeconds ? /^((\d{1,2})?)(\.)(\d{1,})$/ : /^((\d{1,})?)(\.)(\d{1,})$/;
    const decimalRegexResult = decimalRegex.exec(valueToTest);

    if (!decimalRegexResult) {
        return null;
    }

    const hourString = decimalRegexResult.at(1) ? decimalRegexResult.at(2) : '0';
    const minuteString = decimalRegexResult.at(4) ?? '0';

    const timeString = `${hourString}.${minuteString}`;
    const seconds = Math.ceil((+timeString * 60 * 60));

    if (!validateSeconds) {
        return seconds;
    }

    return seconds < 86400 ? seconds : null;
}

/** Function to test for the following input examples:
 *  - 1h
 *  - 1m
 *  - 10h
 *  - 10m
 *  - 1
 *  - 11
 *  - 1059
 *  - Regex validates if hour group is below 24 and minute group is below 60 
 */
export function parseHumanReadableValueToSeconds(value: string): number | null {
    const regex = /^(([01]?[0-9]|[0-3])([hu]))?((([0-5]?[0-9])(m)))?$/;
    const regexResult = regex.exec(cleanValue(value));

    if (!regexResult) {
        return null;
    }

    const hours = regexResult.at(2) ?? 0;
    const minutes = regexResult.at(6) ?? 0;

    const seconds = (+hours * 3600) + (+minutes * 60);

    return seconds < 86400 ? seconds : null; 
}

export function secondsToHoursAndMinutes(seconds: number): {hours: number, minutes: number} {
    const hours = Math.floor(seconds / 3600);
    const restSeconds = seconds % 3600;
    const minutes = Math.floor(restSeconds / 60);

    return {
        hours,
        minutes
    }
}