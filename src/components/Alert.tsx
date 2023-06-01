import { FunctionComponent, createElement, Fragment } from "react";
import classNames from "classnames";
import { AlertIcon } from "./AlertIcon";
import { Tooltip } from "./Tooltip/components/Tooltip";
export interface AlertProps {
    alertStyle?: "default" | "primary" | "success" | "info" | "warning" | "danger";
    className?: string;
    mendixFeedback: boolean;
    instructionMessage?: string;
}
export const Alert: FunctionComponent<AlertProps> = ({ alertStyle, className, instructionMessage, children, mendixFeedback }) =>
    children ? (
        mendixFeedback ? (
        <div className={classNames(`alert alert-${alertStyle} mx-validation-message`, className)}>
            {children}
            {instructionMessage ? (<div className="custom-alert-instruction">{instructionMessage}</div>) : undefined}
        </div>
        ):(
        <Fragment>
            <Tooltip
                autoClose={true}
                offsetDistance={24}
                showArrow={false}
                tooltipTriggerContent={(
                    <div className={`custom-alert alert-${alertStyle}`}>
                        <AlertIcon />
                    </div>
                )}
                tooltipContent={(
                    <div>{children}{instructionMessage ? (<div className="custom-alert-instruction">{instructionMessage}</div>) : undefined}</div>
                )}
            />
        </Fragment>
        )
    ) : null;
Alert.displayName = "Alert";
Alert.defaultProps = { alertStyle: "danger" };