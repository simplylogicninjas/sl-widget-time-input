import { ReactElement, createElement, Fragment, useState, useEffect, useRef } from "react";
import { ValueStatus, ActionValue } from "mendix";
import { ActionProps, TimeInput } from "./components/TimeInput";
import { Alert } from "./components/Alert";
import { SLTimeInputContainerProps } from "../typings/SLTimeInputProps";

import "./ui/SLTimeInput.css";
import "./components/Tooltip/ui/SLTooltip.css";
import Big from "big.js";
import TimeStatic from "./components/TimeStatic";

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

    const applyBtnActionRef = useRef<ActionValue>();
    const cancelBtnActionRef = useRef<ActionValue>();

    const onTimeInputChange = (output: Date | number | undefined) => {
        setAlert(undefined)

        if (typeof output === 'undefined') {
            props.value.setValue(undefined);
        } else if (output instanceof Date) {
            props.value.setValue(output)
        } else {
            props.value.setValue(Big(output as number))
        }
    }

    const onTimeInputError = () => {
        setAlert(props.invalidMessage?.value)
    }

    const onApplyBtnClick = () => {
        if (applyBtnActionRef.current && applyBtnActionRef.current.canExecute) {
            applyBtnActionRef.current.execute();
        } else {
            console.warn('Cannot execute applyBtn action');
        }
    }

    const onCancelBtnClick = () => {
        if (cancelBtnActionRef.current && cancelBtnActionRef.current.canExecute) {
            cancelBtnActionRef.current.execute();
        } else {
            console.warn('Cannot execute cancelBtn action');
        }
    }

    const getActionsConfig = (): ActionProps => {
        const actionConfig: ActionProps = {
            enabled: props.enableActions
        }

        if (props.enableActions) {
            actionConfig.config = {
                applyBtn: {
                    className: props.applyBtnClass?.value ?? '',
                    onClick: onApplyBtnClick
                },
                cancelBtn: {
                    className: props.cancelBtnClass?.value ?? '',
                    onClick: onCancelBtnClick
                }
            }
        }

        return actionConfig;
    }

    const renderTimeComponent = () => {
        if (props.displayMode === 'input') {
            return (
                <TimeInput
                    value={inputValue}
                    tabIndex={props.tabIndex}
                    outputFormat={getOutputFormat(props.value.value)}
                    outputDate={props.value.value && props.value.value instanceof Date ? props.value.value : new Date()}
                    onChange={onTimeInputChange}
                    disabled={props.value?.readOnly}
                    onError={onTimeInputError}
                    actions={{...getActionsConfig()}}
                >
                    <Alert mendixFeedback={props.mendixFeedback} instructionMessage={props.instructionMessage?.value}>{alert}</Alert>
                </TimeInput>
            )
        }

        if (props.displayMode === 'static') {
            return (
                <TimeStatic value={inputValue} />
            )
        }
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

    useEffect(() => {
        applyBtnActionRef.current = props.applyAction
    }, [props.applyAction?.canExecute])

    useEffect(() => {
        cancelBtnActionRef.current = props.cancelAction
    }, [props.cancelAction?.canExecute])

     return <Fragment>
        {renderTimeComponent()}
    </Fragment>;
}
