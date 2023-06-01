import { ReactElement, createElement } from "react";
import { TimeInput } from "./components/TimeInput";
import { SLTimeInputPreviewProps } from "../typings/SLTimeInputProps";

export function preview(_: SLTimeInputPreviewProps): ReactElement {
    return <TimeInput actions={{enabled: false}} />;
}

export function getPreviewCss(): string {
    return require("./ui/SLTimeInput.css");
}
