import { FunctionComponent, createElement, Fragment } from "react";
import classNames from "classnames";
import { AlertIcon } from "./AlertIcon";
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
            <div className={`custom-alert alert-${alertStyle}`}>
                <AlertIcon />
            </div>
            <div className="custom-alert-tooltip">{children}{instructionMessage ? (<div className="custom-alert-instruction">{instructionMessage}</div>) : undefined}</div>
        </Fragment>
        )
    ) : null;
Alert.displayName = "Alert";
Alert.defaultProps = { alertStyle: "danger" };