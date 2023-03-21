import { ReactElement, createElement, Fragment, useState, useEffect } from "react";
import { ValueStatus } from "mendix";
import { TimeInput } from "./components/TimeInput";
import { Alert } from "./components/Alert";
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

function parseValue(value: Date | Big | undefined): string {
    if (value) {
        let inputValue = value;

        if (inputValue instanceof Date) {
            const hourString = inputValue?.getHours().toString();
            const minuteString = inputValue?.getMinutes().toString();

            return `${hourString.length === 1 ? `0${hourString}` : hourString}:${minuteString.length === 1 ? `0${minuteString}` : minuteString}`;
        } else {
            return inputValue.toString().replace('.', ',');
        }
    } else {
        return '';
    }
}

export function SLTimeInput(props: SLTimeInputContainerProps): ReactElement {
    const [alert, setAlert] = useState<string>();
    const [inputValue, setInputValue] = useState<string | undefined>();

    const onTimeInputChange = (output: Date | number | undefined) => {
        setAlert(undefined)

        if (typeof output === 'undefined') {
            props.value.setValue(undefined);
        }

        if (output instanceof Date) {
            props.value.setValue(output)
        } else {
            props.value.setValue(Big(output as number))
        }
    }

    const onTimeInputError = () => {
        setAlert(props.invalidMessage?.value)
    }

    useEffect(() => {
        props.value?.validation ? setAlert(props.value.validation) : setAlert(undefined)
    },[props.value?.validation])

    useEffect(() => {
        if (props.value && props.value.status === ValueStatus.Available) {
            setInputValue(
                parseValue(props.value.value)
            )
        }
    }, [props.value?.value])

     return <Fragment>
        <TimeInput
            value={inputValue}
            tabIndex={props.tabIndex}
            outputFormat={getOutputFormat(props.value.value)}
            outputDate={props.value.value && props.value.value instanceof Date ? props.value.value : new Date()}
            onChange={onTimeInputChange}
            disabled={props.value?.readOnly}
            onError={onTimeInputError}
        >
        <Alert mendixFeedback={props.mendixFeedback} instructionMessage={props.instructionMessage?.value}>{alert}</Alert>
        </TimeInput>
    </Fragment>;
}
