import { ReactElement, createElement } from "react";
import { TimeInput } from "./components/TimeInput";

import { SLTimeInputContainerProps } from "../typings/SLTimeInputProps";

import "./ui/SLTimeInput.css";
import Big from "big.js";

function getOutputFormat(value?: Date | Big): 'datetime' | 'decimal' {
    if (!value) {
        return 'datetime'
    }

    if (value instanceof Date) {
        return 'datetime'
    } else {
        return 'decimal'
    }
}

function parseValue(value: Date | Big | string = '00:00') {
    let inputValue = value;

    if (!value) {
        inputValue = new Date();
    }

    if (inputValue instanceof Date) {
        const hourString = inputValue?.getHours().toString();
        const minuteString = inputValue?.getMinutes().toString();

        return `${hourString.length === 1 ? `0${hourString}` : hourString}:${minuteString.length === 1 ? `0${minuteString}` : minuteString}`;
    } else {
        return inputValue.toString().replace('.', ',');
    }
}

export function SLTimeInput({value}: SLTimeInputContainerProps): ReactElement {
    const onTimeInputChange = (output: Date | number) => {
        if (output instanceof Date) {
            value.setValue(output)
        } else {
            value.setValue(Big(output))
        }
    }

    return <TimeInput
        value={parseValue(value?.value)}
        outputFormat={getOutputFormat(value.value)}
        outputDate={value.value && value.value instanceof Date ? value.value : new Date()}
        onChange={onTimeInputChange}
    />;
}
